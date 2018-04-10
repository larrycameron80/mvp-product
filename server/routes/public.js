const Express = require('express');
const Router = Express.Router();

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const FS = require('fs');

const PlatformModel = require(Libs + 'models/ad_platform');
const GroupModel = require(Libs + 'models/groups');


function getModelById(model_id, lists) {
    for(var i in lists) {
        if(lists[i].id == model_id) return lists[i].name;
    }
    return '';
}


Router.get('/map_points', function(req, res) {
    let CountryList = JSON.parse(FS.readFileSync(Libs + 'jsons/Country.json', 'utf8'));
    let CityList = JSON.parse(FS.readFileSync(Libs + 'jsons/City.json', 'utf8'));

	let filter = {};

	if(req.query.theme_id) {
		filter['theme_id'] = req.query.theme_id;
	}

	if(req.query.rubric_id) {
		filter['rubric_id'] = req.query.rubric_id;
	}

	PlatformModel.find(filter,'id name lat lng theme_id active rubric_id total_clicks total_shows country city street house house_section apartment').exec(function(err, result) {
		let maps = [];
		if(result) {
			result.forEach(function(item) {
				let ctr = (item.total_shows > 0) ? (item.total_clicks/item.total_shows) : 0;

                let house = (item.house) ? ', ' + item.house : '';
                let house_section = (item.house_section) ? ', ' + item.house_section : '';
                let apartment = (item.apartment) ? ', ' + item.apartment : '';


				maps.push({
					id: item.id,
					name: item.name,
					coords: {lat: item.lat, lng: item.lng},
                    address: getModelById(item['country'], CountryList) + ', ' + getModelById(item['city'], CityList) + ', ' + (item.street || '')  + (house) + (house_section)  + (apartment),
					ctr: ctr,
					active: item.active
				})
			});
		}
		res.json({
			result: 'success',
			maps: maps
		})
	});
});

Router.get('/filter', function(req, res) {
	let CountryList = JSON.parse(FS.readFileSync(Libs + 'jsons/Country.json', 'utf8'));
	let CityList = JSON.parse(FS.readFileSync(Libs + 'jsons/City.json', 'utf8'));
	let RubricList = JSON.parse(FS.readFileSync(Libs + 'jsons/Rubrics.json', 'utf8'));
	let ThemesList = JSON.parse(FS.readFileSync(Libs + 'jsons/Themes.json', 'utf8'));
	res.json({
		result: 'success',
		lists: {
			country: CountryList,
			city: CityList,
			rubric: RubricList,
			themes: ThemesList,
		}
	})
});

Router.get('/user_lists', function(req, res) {
	GroupModel.find({active: 1},'id name').exec(function(err, groups) {
		if(err) {
			res.json({result: 'error', data: 'error load users groups'});
		} else {
			let CountryList = JSON.parse(FS.readFileSync(Libs + 'jsons/Country.json', 'utf8'));
			let CityList = JSON.parse(FS.readFileSync(Libs + 'jsons/City.json', 'utf8'));
			let result_groups = {};

			groups.forEach(function(group) {
				result_groups[group.id] = group.name;
			});
			
			res.json({
				result: 'success',
				country_list: CountryList,
				city_list: CityList,
				groups: result_groups
			});
		}
	});
});


module.exports = Router;