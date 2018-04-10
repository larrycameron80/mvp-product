const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const UserModel = require(Libs + 'models/user');
const GroupModel = require(Libs + 'models/groups');
const LangModel = require(Libs + 'models/languages');
const FS = require('fs');



Router.put('/update_lang', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if(req.user && req.user.userId) {
		if(req.body.locale) {
            LangModel.findOne({locale: req.body.locale}).exec(function(err, lang) {
            	if(err) {
            		res.json({result: 'error', data: 'error load lang: ' + err.message});
				} else {

            		if(lang) {
            			UserModel.findById(req.user.userId).exec(function(err, user) {
            				if(err) {
            					res.json({result: 'error', data: 'error find user'});
							} else {
            					if(user) {
									user.lang_id = lang.id;
									user.save(function(err, result) {
										res.json({result: 'success', data: 'updated'});
									});
								} else {
            						res.json({result: 'error', data: 'error update user'});
								}
							}
						});
					} else {
                        res.json({result: 'error', data: 'lang not found'});
					}
				}
			});
		}
	} else {
		res.json({result: 'error', data: 'not auth'});
	}
});


Router.get('/self_info', Passport.authenticate('bearer', {session: false}), function(req, res) {
	UserModel.findOne({_id: req.user.userId},'id email balance first_name second_name third_name user_rule lang_id').populate('user_rule','id name alias').populate('lang_id','id name locale').exec(function(err, data) {
		if(err) {
			res.json({result: 'error', data: 'error load self info: ' + err.message});
		} else {
			
			res.json({
				result: 'success',
				info: {
					email: data.email,
					user_id: data.id,
					balance: data.balance,
					first_name: data.first_name,
					second_name: data.second_name,
					third_name: data.third_name,
					lang: data.lang_id,
					group: {
						alias: data.user_rule[0].alias
					}
				}
			})
		}
	});
});




//регистрация пользователя
Router.post('/', function(req, res) {
	if(req.body && req.body.tel && req.body.login && req.body.password && req.body.company && req.body.position) {
		var newUser = new UserModel({
			email: req.body.login,
			company_name: req.body.company,
			password: req.body.password,
			phone: req.body.tel,
			created_at: new Date(),
			updated_at: new Date()
		});

		newUser.save(function(err, new_user) {
			if(err) {
				res.json({result: 'error', data: err.message});
			} else {
				res.json({result: 'success', data: 'вы успешно зарегистрированы'});
				GroupModel.findOne({alias: req.body.position}, function(err, group) {
					if(group) {
						new_user.user_rule = group.id;
						new_user.save();
					}
				});
			}
		});
	
	} else {
		res.json({result:'error', data: 'не переданы параметры'});
	}
});

//добавление пользователя
Router.post('/add/', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
	if(!user_group) {
		res.json({result: 'error', data: 'error load platforms'});
	} else {
		if(user_group == "admin") {
			let api = 0;


			let user_data = {
				email : req.body.email,
				company_name : req.body.org_name,
				password : req.body.password,
				phone : req.body.phone,
				user_rule : req.body.user_rule,
				created_at : new Date(),
				updated_at : new Date(),
				balance : 0,
				active : (parseInt(req.body.status) && !isNaN(parseInt(req.body.status)) && parseInt(req.body.status) == 1) ? true : false,
				first_name : req.body.first_name,
				second_name : req.body.second_name,
				third_name : req.body.third_name,
				country : req.body.country_id,
				city : req.body.city_id,
				street : req.body.street,
				house : req.body.house,
				house_section : req.body.section,
				apartment : req.body.house_section,
				notifications : req.body.alert_types,
				notifications_types : req.body.notification_types,
				company_inn : req.body.company_inn,
				company_kpp : req.body.company_kpp,
				company_addr : req.body.company_adress,
				company_rs : req.body.company_rs,
				company_cors : req.body.company_cors,
				company_bank_name : req.body.company_bank,
				company_bank_bik : req.body.company_bik,
				api: req.body.api
			};

			if(req.body.lang_id) {
                user_data.lang_id = req.body.lang_id;
			}

			let newUser = new UserModel(user_data);
			newUser.save(function(err, user) {
				if(err) {
					res.json({result: 'error', data: 'error add user: ' + err.message});
				} else {
					res.json({result: 'success', data: 'user add success'});
				}
			});

			//res.json({result: 'test', data: 'test'});
		} else {
			res.json({result: 'error', data: 'error add user'});
		}
	}
});


//обновление пользователя
Router.put('/:id', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
	if(!user_group) {
		res.json({result: 'error', data: 'error load platforms'});
	} else {
		if(user_group == "admin" || req.user.userId == req.params.id) {
			UserModel.findById(req.params.id, function(err, user) {
				if(err) {
					res.json({result: 'error', data: 'error load user info: ' + err.message});
				} else {
					if(!user.id) {
						res.json({result: 'error', data: 'error find user'});
					} else {

						user.email = req.body.email;
						user.company_name = req.body.org_name;
						if(req.body.password) user.password = req.body.password;
						user.phone = req.body.phone;
						user.user_rule = req.body.user_rule;
						user.updated_at = new Date();

						user.active = (parseInt(req.body.status) && !isNaN(parseInt(req.body.status)) && parseInt(req.body.status) == 1) ? true : false;

						if(req.body.api) {
							user.api = req.body.api;
						}

						user.first_name = req.body.first_name;
						user.second_name = req.body.second_name;
						user.third_name = req.body.third_name;
						user.country = req.body.country_id;
						user.city = req.body.city_id;
						user.street = req.body.street;
						user.house = req.body.house;
						user.house_section = req.body.section;
						user.apartment = req.body.house_section;
						user.notifications = req.body.alert_types;
						user.notifications_types = req.body.notification_types;
						user.company_inn = req.body.company_inn;
						user.company_kpp = req.body.company_kpp;
						user.company_addr = req.body.company_adress;
						user.company_rs = req.body.company_rs;
						user.company_cors = req.body.company_cors;
						user.company_bank_name = req.body.company_bank;
						user.company_bank_bik = req.body.company_bik;
						if(req.body.lang_id) {
							user.lang_id = req.body.lang_id;
						}
						user.save(function(err, result) {
							if(err) {
								res.json({result: 'error', data: 'error update user: ' + err.message});
							} else {
								res.json({result: 'success', data: 'user updated'});
							}
						});
					}
				}
			});
		} else {
			res.json({result: 'error', data: 'access denied'});
		}
	}
});

//удаление пользователя
Router.delete('/:id', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
	if(!user_group) {
		res.json({result: 'error', data: 'error load platforms'});
	} else {
		if(user_group == "admin") {
			UserModel.findById(req.params.id, function(err, user) {
				if(err) {
					res.json({result: "error", data: 'error remove user'});
				} else {
					user.remove(function(err, result) {
						if(err) {
							res.json({result: "error", data: 'error remove user'});
						} else {
							res.json({result: "success", data: 'user remove'});
						}
					});
				}
			});
		} else {
			res.json({result: "error", data: "error remove user"})
		}
	}
});

//получение информации о самом себе
Router.get('/', Passport.authenticate('bearer', {session: false}), function(req, res) {

});

//получение списка пользователей
Router.get('/list', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
	if(!user_group) {
		res.json({result: 'error', data: 'error load platforms'});
	} else {
		let per_page = 15;
		let skip = (req.query.page && parseInt(req.query.page) > 0) ? (per_page * (parseInt(req.query.page) - 1)) : 0;
		let filter = {};

		if(req.query.name) {
			filter['$or'] = [
				{first_name: new RegExp(req.query.name,"ig")},
				{second_name: new RegExp(req.query.name,"ig")},
				{third_name: new RegExp(req.query.name,"ig")},
				{company_name: new RegExp(req.query.name,"ig")},
			]
		}

		if(req.query.email) {
			filter.email = new RegExp(req.query.email,"ig")
		}

		if(req.query.phone) {
			filter.phone = new RegExp(req.query.phone,"ig")
		}

		if(req.query.status) {
			filter.active = parseInt(req.query.status) == 1 ? true : false;
		}

		UserModel.find(filter, 'id active email second_name first_name third_name phone balance updated_at created_at country city company_name user_rule owner')
		.populate('user_rule')
		.populate('owner')
		.sort('-updated_at')
		.skip(skip)
		.limit(per_page)
		.exec(function(err, users) {
			if(err) {
				res.json({result: 'error', data: 'error load users: ' + err.message});
			} else {
				let users_result = [];
				users.forEach(function(user) {
					users_result.push({
						id: user.id,
						email: user.email,
						phone: user.phone,
						name: user.second_name + ' ' + user.first_name + ' ' + user.third_name,
						created_at: user.created_at,
						updated_at: user.updated_at,
						balance: user.balance,
						company_name: user.company_name,
						active: user.active,
						owner: user.owner && user.owner.email ? user.owner.email : false,
						group: user.user_rule[0] ? user.user_rule[0].name : false
					});
				});

				UserModel.find(filter).count(function(err, count) {
					res.json({result: 'success', users: users_result, info: {
							per_page: per_page,
							count: count,
							pr: count - skip
					}});
				});
				
			}
		});
	}
});

//получение информации о конкретном пользователе
Router.get('/:id', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
	if(!user_group) {
		res.json({result: 'error', data: 'error load platforms'});
	} else {
		// let filter = {_id: req.params.id};
		
		if(user_group != "admin" && req.params.id != req.user.userId) {
			res.json({result: 'error', data: 'access denied'});
		} else {
			UserModel.findById(req.params.id).populate('user_rule').exec(function(err, user) {
				if(err) {
					res.json({result: 'error', data: 'error load user info: ' + err.message});
				} else {
					if(!user.id) {
						res.json({result: 'error', data: 'user not found'});
					} else {

						LangModel.find({},'id name').exec(function(err, langs) {
							if(err) {
								res.json({result: 'error', data: 'error load langs'});
							} else {
								let result_langs = {};
								langs.forEach(item => result_langs[item.id] = item.name);

                                res.json({result: 'success', user: user, langs: result_langs});
							}
						});


					}
				}
			});
		}
		
	}
});






module.exports = Router;