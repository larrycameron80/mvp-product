const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();

const FS = require('fs');
const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const LangModel = require(Libs + 'models/languages');



Router.get('/', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
    if(!user_group || user_group != "admin") {
        res.json({result: 'error', data: 'access denied'});
    } else {
        LangModel.find({},'id name locale').exec(function(err, langs) {
            if(err) {
                res.json({result: 'error', data: 'error load langs'});
            } else {
                res.json({result: 'success', notificatoin: Config.get('notifications'), langs: langs});
            }
        });
    }
});


Router.put('/:alias', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
    if(!user_group || user_group != "admin") {
        res.json({result: 'error', data: 'access denied'});
    } else {
        let notes = Config.get('notifications');
        let options = req.params.alias.split('_');
        let template = (notes[options[0]] && notes[options[0]][options[1]]) ? notes[options[0]][options[1]] : false;
        if(!template) {
            res.json({result: 'error', data: 'error load template'});
        } else {
            let template_path = Libs + template.path + req.query.lang + '.html';
            FS.writeFile(template_path, req.body.code);
            let titles = JSON.parse(FS.readFileSync(Libs + 'ConfigNotifications.json', 'utf8'));
            titles[options[0]][options[1]][req.query.lang] = req.body.title;
            console.log(titles);
            FS.writeFile(Libs + 'ConfigNotifications.json', JSON.stringify(titles));
            res.json({result:'success', data: 'save'});
        }
    }
});


Router.get('/:alias', Passport.authenticate('bearer', {session: false}), function(req, res) {
    let user_group = (req.user.user_rule && req.user.user_rule[0]) ? req.user.user_rule[0].alias : false;
    if(!user_group || user_group != "admin") {
        res.json({result: 'error', data: 'access denied'});
    } else {
        let notes = Config.get('notifications');
        let options = req.params.alias.split('_');
        let template = (notes[options[0]] && notes[options[0]][options[1]]) ? notes[options[0]][options[1]] : false;

        if(!template) {
            res.json({result: 'error', data: 'error load template'});
        } else {
            let template_path = Libs + template.path + ((req.query && req.query.lang) ? req.query.lang : 'default') + '.html';
            if(!FS.existsSync(template_path)) {
                template_path = Libs + template.path + 'default.html';
            }
            let content = FS.readFileSync(template_path, 'utf8');
            let titles = JSON.parse(FS.readFileSync(Libs + 'ConfigNotifications.json', 'utf8'));
            let notification_options = (req.query && req.query.lang && titles[options[0]][options[1]][req.query.lang]) ? titles[options[0]][options[1]][req.query.lang] : titles[options[0]][options[1]]['default'];
            res.json({result: 'success', code: content, title: template.name, options: notification_options});
        }
    }
});



module.exports = Router;