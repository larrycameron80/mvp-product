const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();
const UniqID = require('uniqid');
const Format = require('date-format');

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const FS = require('fs');
const Redis = require(Libs + 'connectors/redis');
const LangModel = require(Libs + 'models/languages');
const LangPhModel = require(Libs + 'models/languagePlaceholders');

const AXIOS = require('axios');

function updateLang(lang_id) {
    LangModel.findById(lang_id).exec(function(err, lang) {
        if(err) {
            Logs.error('error find lang: ' + err.message);
        }

        if(lang) {
            lang.updated_at = new Date();
            lang.save();
        }

    });
}


function refreshRedisTimestamp(lang_id) {
	let RedisKey = Config.get('redis:locale') + lang_id;
	let ts = (new Date()).getTime().toString();
	Redis.set(RedisKey, ts);
    updateLang(lang_id);
	return ts;
}

function checkAdminRights(userInfo) {
	let user_group = (userInfo.user_rule && userInfo.user_rule[0]) ? userInfo.user_rule[0].alias : false;
	return (user_group && user_group == "admin");
}
// /*получение таймстампа последнего обновления локали*/
// Router.get('/ts/:lang_id', function(req, res) {
// 	LangModel.findById(req.params.lang_id, function(err, lang) {
// 		if(lang) {
// 			var RedisKey = Config.get('redis:locale') + req.params.lang_id;
// 			Redis.get(RedisKey, function(err, data) {
// 				if(err) {
// 					res.json({result : 'error', data : 'error load locale last update timestamp'});
// 				} else {
// 					if (data) {
// 						res.json({result : 'success', data : data});
// 					}
// 					else {
// 						res.json({result : 'success', data : refreshRedisTimestamp(req.params.lang_id)});
// 					}
// 				}
// 			});
// 		}
// 		else {
// 			res.json({result: 'error', data: 'no language found'});
// 		}
// 	});
// });

/*Список языков для админа*/
Router.get('/lang/admin', Passport.authenticate('bearer', {session: false}), function (req, res) {
    LangModel.find({}).sort('name').exec(function(err, langs) {
        if(err) {
            res.json({result: 'error', data: 'error load langs: ' + err.message});
        } else {
            LangPhModel.find({}).exec(function(err, phs) {
                if(err) {
                    res.json({result: 'error', data: 'error load langs: ' + err.message});
                } else {
                    let result_langs = {};
					langs.forEach(function (lang) {
						result_langs[lang.id] = []
					});
                    phs.forEach(function (ph) {
                        if(!result_langs[ph.language_id]) result_langs[ph.language_id] = [];
                        result_langs[ph.language_id].push(ph);
                    });
                    res.json({result: 'success', data: langs, ph: result_langs});
                }
            });

        }
    });
});



/*загрузка плейсхолдеров в рамках одной локали*/
Router.get('/lang/:id', function(req, res) {
	LangModel.findOne({_id: req.params.id}, function(err, lang) {
		if(lang) {
			LangPhModel.find({language_id: lang.id}, 'id name values').exec(function(err, result_phs) {
				if(err) {
					res.json({result: 'error', data: err.message});
				} else {
					let phs = {};
					if (result_phs) {
						result_phs.forEach(function (ph) {
							phs[ph.name] = [...ph.values];
						})
					}
					res.json({result: 'success', data: phs});
				}
			});
		}
		else {
			res.json({result: 'error', data: 'no language found'});
		}
	});
});


/*загрузка списка локалей*/
Router.get('/lang/', function(req, res) {
	let RedisLangsKey = Config.get('redis:locale') + 'languages';
	Redis.get(RedisLangsKey, function(err, data) {
		if (err) {
			res.json({result: 'error', data: err.message});
		}
		else {
			let langs = JSON.parse(data);
			res.json({result: 'success', data: langs});
		}
	});
});

/*создание локали*/
Router.post('/lang/', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if (checkAdminRights(req.user)) {
		// проверим поля
		if (!req.body.name) {
			res.json({result: 'error', data: 'set field `name`'});
		}
		else if (!req.body.locale) {
			res.json({result: 'error', data: 'set field `locale`'});
		}
		else {
			LangModel.find({locale: req.body.locale}).exec(function (err, result) {
				if (result.length) {
					res.json({result: 'error', data: 'already have locale ' + req.body.locale});
				}
				else {
					let newLang = LangModel({
						name: req.body.name,
						locale: req.body.locale,
						created_at: new Date(),
						updated_at: new Date(),
					});
					newLang.save(function (err, createdLang) {
						if (err) {
							res.json({result: 'error', data: 'error creating language: ' + err.message});
						} else {
							// забираем все пх из дефолтной локали и создаем их в новой
							let defaultLocale = Config.get('translate:default').locale;
							LangModel.findOne({locale: defaultLocale}).exec(function(err, lang) {
								if(err) {
									console.log('error load default lang [%s]', err.message);
								} else {
									if (lang) {
										LangPhModel.find({language_id: lang.id}).exec(function(err, phs) {
											if (phs) {
												phs.forEach(function(ph) {
													let plh = {
														name: ph.name,
														language_id: createdLang.id,
														created_at: new Date(),
														updated_at: new Date(),
														values: ph.values,
														unique_key: ph.name + '_' + createdLang.id,
														def: ph.def
													};
													let plhObject = new LangPhModel(plh);
													plhObject.save(function(err, r) {
														if(err) {
															console.log('error [%s]', err.message);
														} else {
															console.log('create ', ph.name);
														}
													});
												});
											}
										});
									}
								}
							});
							res.json({result: 'success', data: 'language created with id: ' + result.id});
							refreshRedisTimestamp(result.id);
						}
					});
				}
			});
		}
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});

/*изменение локали*/
Router.put('/lang/:id', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if (checkAdminRights(req.user)) {
		LangModel.findById(req.params.id, function(err, lang) {
			if(lang) {
				console.log(req.body);
				lang.name = req.body.name;
				lang.locale = req.body.locale;
				lang.updated_at = new Date();
				lang.save(function (err, result) {
					if (err) {
						res.json({result: 'error', data: 'error updating language: ' + err.message});
					} else {
						res.json({result: 'success', data: 'language updated'});
						refreshRedisTimestamp(req.params.id);
					}
				});
			}
			else {
				res.json({result: 'error', data: 'no language found'});
			}
		});
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});

/*удаление локали*/
Router.delete('/lang/:id', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if (checkAdminRights(req.user)) {
		LangModel.findById(req.params.id, function(err, lang) {
			if(lang) {
				lang.remove(function (err, result) {
					if (err) {
						res.json({result: 'error', data: 'error deleting language: ' + err.message});
					} else {
						// и вынесем заодно все пх этой локали
						LangPhModel.find({language_id: req.params.id}).exec(function(err, phs) {
							phs.forEach(function (ph) {
								ph.remove();
							});
							res.json({result: 'success', data: 'language and all phs deleted'});
						});
					}
				});
			}
			else {
				res.json({result: 'error', data: 'no language found'});
			}
		});
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});

/*изменение конкретного плейсхолдера - для админа*/
Router.put('/ph/:id/', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if (checkAdminRights(req.user)) {
        // в противном случае считаем что пришел один плейсхолдер, который мы и обработаем
        LangPhModel.findById(req.params.id, function (err, result) {
            if (err) {
                res.json({result: 'error', data: err.message});
            } else {
                if (result) {
                    result.values = req.body.values;
                    result.updated_at = new Date();
                    result.save(function (err, result) {
                        if (err) {
                            res.json({result: 'error', data: 'error update placeholder: ' + err.message});
                        } else {
                            res.json({result: 'success', data: 'placeholder updated'});
                            refreshRedisTimestamp(result.language_id);
                        }
                    });
                }
                else {
                    res.json({result: 'error', data: 'no placeholder found'});
                }
            }
        });
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});


/*изменение конкретного плейсхолдера - для админа из TranslatePopup
 отличается от редактирования для админа тем, что приходит имя локали, название пх и значения */
Router.put('/ph/', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if (checkAdminRights(req.user)) {
		// если есть элемент phs - берем из него массив плейсхолдеров и перебираем, попутно сохраняя в базу
		if (req.body.locale && req.body.name && req.body.values && req.body.values.length == 3) {
			LangModel.findOne({locale: req.body.locale}, function (err, lang) {
				if (err) {
					res.json({result: 'error', data: 'error finding language: ' + err.message});
				} else {
					if (lang) {
						LangPhModel.findOne({language_id: lang.id, name: req.body.name}, function (err, ph) {
							if (err) {
								res.json({result: 'error', data: 'error finding placeholder: ' + err.message});
							} else {
								if (ph) {
									ph.values = req.body.values;
									ph.save(function (err, result) {
										if (err) {
											res.json({result: 'error', data: 'error update placeholder: ' + err.message});
										} else {
											res.json({result: 'success', data: 'placeholder updated'});
											refreshRedisTimestamp(ph.language_id);
										}
									});
								}
								else {
									res.json({result: 'error', data: 'no placeholder found'});
								}
							}
						});
					}
					else {
						res.json({result: 'error', data: 'no language found'});
					}
				}
			});
		}
		else {
			res.json({result: 'error', data: 'not enough parameters to update placeholder'});
		}
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});

// /*создание плейсхолдера -  для админа*/
// Router.post('/ph/', function(req, res) {
// 	LangPhModel.findOne({language_id: req.body.language_id, name: req.body.name}, function (err, result) {
// 		if (err) {
// 			res.json({result: 'error', data: err.message});
// 		} else {
// 			if (!result) {
// 				// проверим language
// 				LangModel.findById(req.body.language_id, function(err, lang) {
// 					if(lang) {
// 						let newPh = LangPhModel({
// 							name: req.body.name,
// 							language_id: lang.id,
// 							created_at: new Date(),
// 							updated_at: new Date(),
// 						});
// 						newPh.save(function (err, result) {
// 							if (err) {
// 								res.json({result: 'error', data: 'error creating placeholder: ' + err.message});
// 							} else {
// 								res.json({result: 'success', data: 'placeholder created'});
// 								refreshRedisTimestamp(result.language_id);
// 							}
// 						});
// 					}
// 					else {
// 						res.json({result: 'error', data: 'no language found'});
// 					}
// 				});
// 			}
// 			else {
// 				res.json({result: 'error', data: 'placeholder with this name and language_id already exists'});
// 			}
// 		}
// 	});
// });


/*создание плейсхолдера для админа*/
Router.post('/ph/', Passport.authenticate('bearer', {session: false}), function (req, res) {
	// if (checkAdminRights(req.user)) {
	if (true) {
		LangModel.findOne({locale: req.body.locale}, function (err, lang) {
			if (err) {
				res.json({result: 'error', data: err.message});
			} else {
				if (lang) {
					LangPhModel.findOne({name: req.body.name, language_id: lang.id}, function (err, ph) {
						if (err) {
							res.json({result: 'error', data: err.message});
						} else {
							if (ph) {
								res.json({result: 'error', data: 'placeholder with name already exists in this locale'});
							}
							else {
								let newPh = LangPhModel({
									language_id: lang.id,
									name: req.body.name,
									values: req.body.values,
									def: req.body.def
								});
								newPh.save(function (err, result) {
									if (err) {
										res.json({result: 'error', data: 'error creating placeholder: ' + err.message});
									} else {
										res.json({result: 'success', data: 'placeholder created'});
										refreshRedisTimestamp(result.language_id);
									}
								});
							}
						}
					});
				}
				else {
					res.json({result: 'error', data: 'no locale found'});
				}
			}
		});
	}
	else {
		res.json({result: 'error', data: 'only for admin'});
	}
});


module.exports = Router;