/**
 * Created by WorldWifiTeam
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;



const Pages = new Schema({
    title : {
        type : String,
        default : ''
    },
    path : {
        type : String,
        default : ''
    },
    content : {
        type : String,
        default : ''
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


module.exports = Mongoose.model('Pages', Pages);