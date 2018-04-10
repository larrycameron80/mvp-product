/**
 * Created by WorldWifiTeam
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const RefreshToken = new Schema({
    userId : {
        type : String,
        required : true
    },
    token : {
        type : String,
        unique : true,
        required: true
    },

    created_at : {
        type : Date,
        default : Date.now()
    }
});

module.exports = Mongoose.model('RefreshToken', RefreshToken);