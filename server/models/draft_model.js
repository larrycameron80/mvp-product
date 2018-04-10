/**
 * схема для хранения черновиков
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const Drafts = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    model_id: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },

    json_data: {
        type: String,
        default: ''
    },

    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Mongoose.model('Drafts', Drafts)