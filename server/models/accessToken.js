/*
    схема временного токена
    @userId - идентификатор авторизованного пользователя
    @token - строковый токен для авторизации
    @created_at - дата создания токена
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AccessToken = new Schema({
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

module.exports = Mongoose.model('AccessToken', AccessToken);