/**
 * Created by awd on 01.05.17.
 */
const Mongoose = require('mongoose');
const Shema = Mongoose.Schema;
const Libs = __dirname + '/../';
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);
const RedisClient = require(Libs + 'connectors/redis');



const Group = new Shema({
    name : {
        type : String,
        required : true,
    },

    alias : {
        type : String,
        required: true,
        unique : true
    },

    active : {
        type : Boolean,
        default : true
    },

    visible : {
        type : Boolean,
        default : false
    },

    description : {
        type : String
    },

    created_at : {
        type : Date,
        default : Date.now()
    },

    updated_at : {
        type : Date,
        default : Date.now()
    }
});


Group.methods.clearRedis = function () {
    var RedisGroupKey = Config.get('redis:user_group') + this.id;
    var RedisGroupRules = Config.get('redis:group_rules') + this.id;
    RedisClient.del(RedisGroupKey);
    RedisClient.del(RedisGroupRules);
    Logs.info('clear redis cache [%s]', RedisGroupKey);
    Logs.info('clear redis cache [%s]', RedisGroupRules);
};

module.exports = Mongoose.model('Group', Group);