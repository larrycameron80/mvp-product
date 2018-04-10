const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const FS = require('fs');


/*загрузка списка листов*/
Router.get('/', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;

    if(!user_group || user_group !="admin") {
        res.json({result: 'error', data: 'error load groups'});
    } else {

        let list = Config.get('lists');

        for(var i in list) {
            let items = JSON.parse(FS.readFileSync(Libs + list[i]['path'], 'utf8'));
            let stat = FS.statSync(Libs + list[i]['path']);
            list[i].count = items ? items.length : 0;
            list[i].update_at = stat.mtime;
            list[i].items = items;
            if(list[i].alias == "city") {
                list[i].country_list = JSON.parse(FS.readFileSync(Libs + 'jsons/Country.json', 'utf8'));
            }
        }

        res.json({result: 'success', lists: list});
    }
});


/*загрузка элементов справочника*/
Router.get('/:alias', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;

    if (!user_group || user_group != "admin") {
        res.json({result: 'error', data: 'error load groups'});
    } else {
        let lists = Config.get('lists');
        let list_info = {};
        for(var i in lists) {
            if(lists[i].alias == req.params.alias) {
                list_info = lists[i];
            }
        }

        if(list_info && list_info['path']) {
            let list_items = JSON.parse(FS.readFileSync(Libs + list_info['path'], 'utf8'));
            let info = {};
            if(list_info['alias'] == 'city') {
                info.country = JSON.parse(FS.readFileSync(Libs + 'jsons/Country.json', 'utf8'));
            }
            res.json({result: 'success', items: list_items, list: list_info, info: info});
        } else {
            res.json({result: 'error', data: 'list not found'});
        }
    }
});


//сохранение справочника
Router.post('/:alias', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;

    if (!user_group || user_group != "admin") {
        res.json({result: 'error', data: 'error load groups'});
    } else {
        let lists = Config.get('lists');
        let file = false;
        lists.forEach(function(item) {
            if(item.alias == req.params.alias) {
                file = item.path;
            }
        });

        if(file !== false && req.body.items && req.body.items.length > 0) {
            let string_date = JSON.stringify(req.body.items);
            FS.writeFile(Libs + file, string_date);
            res.json({result: 'success', data: 'list updated'});
        } else {
            res.json({result: 'error', data: 'list not found'});
        }
    }
});


module.exports = Router;
