const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();
const Mongoose = require('mongoose');

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');

const UserModel = require(Libs + 'models/user');
const PlatformModel = require(Libs + 'models/ad_platform');
const BannerModel = require(Libs + 'models/banners');
const PriceModel = require(Libs + 'models/ads_prices');
const StatModel = require(Libs + 'models/banners_stats');

function clearDateStart(date) {
	let d = new Date(date);
	d.setHours(3);
	d.setMinutes(0);
	d.setSeconds(0);
	return d;
}

function clearDateEnd(date) {
	let d = new Date(date);
	d.setHours(26);
	d.setMinutes(59);
	d.setSeconds(59);
	return d;
}


/*роут вернет статистику по последним 20 пользователям*/
Router.get('/users', Passport.authenticate('bearer', {session: false}), function(req, res) {
//	console.log('hello');
	UserModel.find({},'id email created_at user_rule active second_name first_name third_name').populate('user_rule').limit(20).sort('-created_at').exec(function(err, users) {
		if(err) {
			res.json({result: 'error', data: err.message});
		} else {
			let result_users = [];
			if(users.length > 0) {
				//формируем данные для отдачи
				users.forEach(function(user) {

					result_users.push({
						created_at: user.created_at,
						id: user.id,
						email: user.email,
						group: (user.user_rule[0]) ? user.user_rule[0].name : false,
						active: user.active,
						name: (user.second_name || '') + ' ' + (user.first_name || '') + ' ' + (user.third_name || '')
					});
				});
			}
			res.json({result: 'success', users: result_users});
		}
	});
});


/*роут вернет статстику по последним 20 платформам*/
Router.get('/paltforms', Passport.authenticate('bearer', {session: false}), function(req, res) {
	PlatformModel.find({},'id name uid user_id status created_at active').populate('user_id').sort('-created_at').limit(20).exec(function(err, platforms) {
		if(err) {
			res.json({result: 'error', data: err.message});
		} else {
			let result_platforms = [];
			if(platforms.length > 0) {
				platforms.forEach(function(platform) {
					result_platforms.push({
						created_at: platform.created_at,
						id: platform.id,
						name: platform.name,
						uid: platform.uid,
						user_email: (platform.user_id) ? platform.user_id.email : '{unknow}',
						user_id: (platform.user_id) ? platform.user_id.id : '{unknow}',
						status: platform.status,
						active: platform.active,
					});
				});
			}
			res.json({result: 'success', platforms: result_platforms});
		}
	});
});


/*роут вернет статстику по последним 20 кампания*/
Router.get('/banners', Passport.authenticate('bearer', {session: false}), function(req, res) {
	BannerModel.find({}, 'id user_id name created_at banner_type uid show_status link').populate('user_id').sort('-created_at').limit(20).exec(function(err, banners) {
		if(err) {
			res.json({result: 'error', data: err.message});
		} else {
			let result_banners = [];
			
			if(banners.length > 0) {
				banners.forEach(function(banner) {
					result_banners.push({
						created_at: banner.created_at,
						id: banner.id,
						name: banner.name,
						banner_type: banner.banner_type,
						status: banner.show_status,
						link: banner.link,

						uid: banner.uid,
						user_email: (banner.user_id) ? banner.user_id.email : '{unknow}',
						user_id: (banner.user_id) ? banner.user_id.id : '{unknow}'
					});
				});
			}
			
			res.json({result: 'success', banners: result_banners});
		}
	});
});


Router.get('/all', Passport.authenticate('bearer', {session: false}), function(req, res) {
	let per_page = 15;
	let skip = (req.query.page && parseInt(req.query.page) > 0) ? ((parseInt(req.query.page) - 1) * per_page) : 0;
	let filter = {};

	if(req.query.date_start) {
		filter.date = {
			$gte: clearDateStart(req.query.date_start)
		}
	}

	if(req.query.date_end) {
		filter.date = {
			$lte: clearDateEnd(req.query.date_end)
		}
	}

	if(req.query.date_start && req.query.date_end) {
		filter.date = {
			$gte: clearDateStart(req.query.date_start),
			$lte: clearDateEnd(req.query.date_end)
		}
	}


	let AgregateStats = [
		{$project : {_id : 0, date : 1, event_type : 1, banner_id : 1, platform_id : 1, event_cost : 1, stat_date : {$dateToString : {format : '%Y-%m-%d', date : '$date'}}}},
		{$match : filter},
		{$sort : {stat_date : 1}},
		{$group : {_id : {banner_id : '$banner_id',platform_id: '$platform_id',event_type : '$event_type',stat_date : '$stat_date',},events_count: {$sum : 1},total_sum : {$sum : '$event_cost'}}},
		{$group : {
			_id : null,
			total : {$sum : 1},
			results : {$push : '$$ROOT'}
		}},
		
		{$project: {
			total : 1,
			stats : {
				$slice : ['$results', skip, per_page]
			}
		}}
	];

	StatModel.aggregate(AgregateStats, function(err, stats) {
		if(err) {
			res.json({result: 'error', data: 'error load stats: ' + err.message});
		} else {
			let calc = stats[0];
			let platforms = [], banners = [];
			
			if(calc && calc.stats) {

				calc.stats.forEach(function(item) {
					platforms.push(Mongoose.Types.ObjectId(item._id.platform_id));
					banners.push(Mongoose.Types.ObjectId(item._id.banner_id));
				});

				PlatformModel.find({'_id' : {$in: platforms}}, 'id name uid', function(err, platforms) {
					if(err) {
						res.json({result: 'error', data: 'error load platforms: ' + err.message});
					} else {
						BannerModel.find({'_id' : {$in: banners}}, 'id name uid',function(err, banners) {
							if(err) {
								res.json({result: 'error', data: 'error load banners: ' + err.message});
							} else {
								let result_stats = {}, result_banners = {}, result_platforms = {};

								platforms.forEach(function(item) {
									result_platforms[item._id] = {name: item.name, uid: item.uid};
								});

								banners.forEach(function(item) {
									result_banners[item._id] = {name: item.name, uid: item.uid};
								});

								stats[0].stats.forEach(function(item) {
									let key = item._id.stat_date + '_' + item._id.banner_id + '_' + item._id.platform_id;
									if(!result_stats[key]) {
										result_stats[key] = {
											'date': item._id.stat_date,
											'platform_uid': result_platforms[item._id.platform_id] ? result_platforms[item._id.platform_id].uid : '{unknown}',
											'banner_uid': result_banners[item._id.banner_id] ? result_banners[item._id.banner_id].uid : '{unknown}',
											'platform_id': item._id.platform_id,
											'banner_id': item._id.banner_id,
											'platform_name': result_platforms[item._id.platform_id] ? result_platforms[item._id.platform_id].name : '{unknown}',
											'banner_name': result_banners[item._id.banner_id] ? result_banners[item._id.banner_id].name : '{unknown}',
											'clicks': (item._id.event_type == 'click') ? item.events_count : 0,
											'shows': (item._id.event_type == 'show') ? item.events_count : 0,
											'total_clicks': (item._id.event_type == 'click') ? item.total_sum : 0,
											'total_shows': (item._id.event_type == 'show') ? item.total_sum : 0,
											'total': item.total_sum
										}
									} else {
										result_stats[key].clicks += (item._id.event_type == 'click') ? item.events_count : 0;
										result_stats[key].shows += (item._id.event_type == 'show') ? item.events_count : 0;
										result_stats[key].total_clicks += (item._id.event_type == 'click') ? item.events_count : 0;
										result_stats[key].total_shows += (item._id.event_type == 'show') ? item.events_count : 0;
										result_stats[key].total += item.total_sum
									}
								});

								let stats_array = [];
								for(var i in result_stats) {
									stats_array.push(result_stats[i]);
								}



								res.json({
									result: 'success',
									info: {
										per_page: per_page,
										count: stats[0].total,
										pr: stats[0].total - skip
									},
									stats: stats_array
								});
							}
						});
					}
				})

			} else {
				res.json({result: 'info', data: 'stats not found'});
			}


			
		}
	});



});


module.exports = Router;