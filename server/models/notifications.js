/**
 * Created by WorldWifiTeam
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Libs = __dirname + '/../';
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);

const SendMail = require('sendmail')({silent: true});
const User = require('./user');
const Group = require('./groups');
const M2Templater = require(Libs + 'library/M2Templater')();


const Notifications = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    type: {type : String, default : ''},
    title: {type : String, default: ''},
    text: {type : String, default : ''},
    date: {type : Date, default: Date.now()},
    visible : {type : Boolean, default : true}
});


Notifications.post('save', function(obj) {
    if(obj.user_id) {
        User.findById(obj.user_id, function(err, result) {
            if(!err && result && result.email) {
                let template = M2Templater.view(Libs + Config.get('templates:email:default'), {
                    header : obj.title,
                    body : obj.text
                });

                let sendMailOptions = {
                    from : Config.get('sendmail:from'),
                    to : result.email,
                    subject : obj.title,
                    html : template
                };

                SendMail(sendMailOptions, function(error, reply) {
                    Logs.error(error && error.stack);
                    Logs.info(reply);
                });
            }
        });
    }
});





module.exports = Mongoose.model('Notifications', Notifications);