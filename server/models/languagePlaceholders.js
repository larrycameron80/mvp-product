/**
 * Created by WorldWifiTeam
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
require('mongoose-double')(Mongoose);
const Libs = __dirname + '/../';
const DB = require(Libs + 'connectors/db');
const LangModel = require(Libs + 'models/languages');



const LanguagePlaceholders = new Schema({
    name : {
        type : String
    },
    language_id : {
        type : Schema.ObjectId,
        ref  : 'Language',
        requried : true
    },
    values : {
        type: Array,
        default: ['', '', '']
    },
    created_at : {
        type : Date,
        default : Date.now()
    },
    updated_at : {
        type : Date,
        default : Date.now()
    },
    def: {
        type: String,
        default: ''
    },
    unique_key: {type: String, unique: true, default: ''}
});




LanguagePlaceholders.pre('save', function(next, done) {
    this.unique_key = this.name + '_' + this.language_id;
    next();
});

LanguagePlaceholders.post('save', function(obj) {
    let self = this;
    LangModel.find({_id: {$nin: [obj.language_id]}}).exec(function(err, langs) {
        if(err) {
            //console.log('error load langs [%s]', err.message);
        } else {
            langs.forEach(function(item) {
                let plh = {
                    name: obj.name,
                    language_id: item.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    values: obj.values,
                    unique_key: obj.name + '_' + item.id,
                    def: obj.def
                };
                let model = Mongoose.model('LanguagePlaceholders', LanguagePlaceholders);
                let plhObject = new model(plh);
                plhObject.save(function(err, r) {
                    if(err) {
                        //console.log('error [%s]', err.message);
                    } else {
                        //console.log('create');
                    }
                });
            });
            //console.log(self);
        }
    });
});



module.exports = Mongoose.model('LanguagePlaceholders', LanguagePlaceholders);