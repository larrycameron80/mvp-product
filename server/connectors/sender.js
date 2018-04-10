const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');

const FS = require('fs');
const Smarty = require('smarty.js');
const SendMail = require(Libs + 'connectors/mail');


module.exports = function(user_to, langs, data, sender, type) {
    data.path = Config.get('path');

    let MailTitle = JSON.parse(FS.readFileSync(Libs + 'ConfigNotifications.json', 'utf8'));
    if(user_to && user_to.email) {
        let t_config = Config.get('notifications:' + sender + ':' + type);
        let locale = (user_to.lang_id && langs[user_to.lang_id]) ? langs[user_to.lang_id] : 'default';
        let title = (MailTitle[sender][type][locale]) ? MailTitle[sender][type][locale] : MailTitle[sender][type]['default'];
       // console.log(sender, type, locale, MailTitle[sender][type][locale]);

        //find mail template for lang
        let template = '';
        if(FS.existsSync(Libs + t_config.path + locale + '.html')) {
            template = FS.readFileSync(Libs + t_config.path + locale + '.html',{encoding: 'utf-8'});
        } else {
            template = FS.readFileSync(Libs + t_config.path + 'default.html',{encoding: 'utf-8'});
        }

        let compiledBody = new Smarty(template), comilideTitle = new Smarty(title);

        let sendMailOptions = {
            from: Config.get('sendmail:from'),
            to: user_to.email,
            subject: comilideTitle.fetch(data),
            html: compiledBody.fetch(data),
        };
       // console.log(sendMailOptions);
        SendMail(sendMailOptions, function(err, reply) {
            console.log('message send');
        });
    }
}
