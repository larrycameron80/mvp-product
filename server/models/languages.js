const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
require('mongoose-double')(Mongoose);

const Language = new Schema({
    name : {
        type : String
    },
    locale : {
        type : String,
        unique : true,
    },
    created_at : {
        type : Date,
        default : Date.now()
    },
    updated_at : {
        type : Date,
        default : Date.now()
    },
});




module.exports = Mongoose.model('Language', Language);