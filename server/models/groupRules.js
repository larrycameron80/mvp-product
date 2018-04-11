/**
 * Created by awd on 01.05.17.
 */
const Mongoose = require('mongoose');
const Shema = Mongoose.Schema;


const GroupRules = new Shema({
    group_id : {
        type : Shema.ObjectId,
        ref  : 'Group',
        requried : true
    },
    route : {
        type : String,
        required : true
    },
    created_at : {
        type : Date,
        default: Date.now()
    },
    updated_at : {
        type : Date,
        default : Date.now()
    }
});



module.exports = Mongoose.model('GroupRules', GroupRules);