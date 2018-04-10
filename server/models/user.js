/**
 * Created by WorldWifiTeam
 */
const Mongoose = require('mongoose');
const Crypto = require('crypto');
const Schema = Mongoose.Schema;
const Libs = __dirname + '/../';
const Groups = require(Libs + 'models/groups');
const GroupRules = require(Libs + 'models/groupRules');
const RedisClient = require(Libs + 'connectors/redis');
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);
require('mongoose-double')(Mongoose);

const User = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    },
    company_name : {
        type : String,
        required: true
    },
    encPassword : {
        type : String,
        required : true,
    },
    phone : {
        type : String
    },
    user_rule : [{type: Schema.Types.ObjectId, ref: 'Group' }],
    created_at : {
        type : Date,
        default : Date.now()
    },
    updated_at : {
        type : Date,
        default : Date.now()
    },
    last_login_at : {
        type : Date
    },
    balance : {type : Schema.Types.Double, default: 0},
    active : {
        type : Boolean,
        default : true
    },
    salt : {
        type: String,
        required: true
    },
    first_name : {
        type : String
    },
    second_name : {
        type : String
    },
    third_name : {
        type : String
    },
    country : {
        type : Number,
        default : 1
    },
    city : {
        type : Number,
        default : 1
    },
    street : {
        type : String
    },
    house : {
        type : String
    },
    house_section : {
        type : String
    },
    apartment : {
        type : String
    },
    notifications : {
        type: Number,
        default : 0
    },
    notifications_types : {
        type : Number,
        default : 0
    },
    comment : {
        type : String
    },


    company_inn : {type : String, default : ''},
    company_kpp : {type : String, default : ''},
    company_addr : {type : String, default : ''},
    company_rs : {type : String, default : ''},
    company_cors : {type : String, default : ''},
    company_bank_name : {type : String, default : ''},
    company_bank_bik : {type : String, default : ''},
    company_bank_ogrn : {type : String, default : ''},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    api: {type: Number, default: 1},
    lang_id: {type: Schema.Types.ObjectId, ref: 'Language'}
});

User.methods.encryptPassword = function(password) {
    return Crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.virtual('userId').get(function () {
    return this.id;
});


User.methods.cancan = function(route) {
    var RedisGroupKey = Config.get('redis:prefix') + 'group' + (this.user_rule[0] ? this.user_rule[0] : 0);
    var RedisGroupRules = Config.get('redis:prefix') + 'group_rules' + this.user_rule[0];
    var self = this;
    var __promise = new Promise(function(resolve, reject) {
        RedisClient.get(RedisGroupKey, function(error, result) {
            if(result == null) {
                Groups.findById(self.user_rule[0], function(error, group) {
                    var jsonGroup = JSON.stringify({id : group.id, name : group.name, alias : group.alias});
                    RedisClient.set(RedisGroupKey, jsonGroup)
                    if(group.name == "admin") {
                        resolve(JSON.parse(jsonGroup));
                    }
                    GroupRules.find({group_id: group.id}, function(error, rules) {
                        var rulesJson = [];
                        rules.forEach(function(element) {
                            rulesJson.push({route : element.route, groupId : element.group_id});
                        });
                        RedisClient.set(RedisGroupRules, JSON.stringify(rulesJson));
                        for(var i in rulesJson) {
                            if(rulesJson[i].route == route) {
                                resolve(group);
                            }
                        }
                        reject(new Error('Access denied'));
                    });
                });
            } else {
                var GroupInfo = JSON.parse(result);
                if(!GroupInfo) {
                    reject(new Error('Group politic not found'));
                }

                if(GroupInfo.alias == 'admin') {
                    resolve(GroupInfo);
                }

                RedisClient.get(RedisGroupRules, function(error, group_rules) {
                    if(!group_rules) reject(new Error('Group politic not found'));
                    group_rules = JSON.parse(group_rules);
                    for(var i in group_rules) {
                        if(group_rules[i].route == route) {
                            resolve(GroupInfo);
                        }
                    }
                    reject(new Error('Access denied'));
                });

            }
        });
    });
    return __promise;
};



User.virtual('password')
    .set(function(password) {
        this.__plainPassword = password;
        this.salt = Crypto.randomBytes(32).toString('hex');
        this.encPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this.__plainPassword;
    });

User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.encPassword;
}

User.post('save', function(obj) {
    //console.log('send notification to admins');
});



module.exports = Mongoose.model('User', User)