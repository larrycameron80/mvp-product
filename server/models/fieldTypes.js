/**
 * Created by WorldWifiTeam
 */
const Mongoose = require('mongoose');
const Shema = Mongoose.Schema;


const FieldTypes = new Shema({
    name : {
        type : String,
        default : 'TextInput'
    },
    description : {
        type : String,
        default : 'Текстовое поле'
    }
});


module.exports = Mongoose.model('FieldTypes', FieldTypes);