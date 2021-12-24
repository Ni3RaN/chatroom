const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/190110910625');
const messageSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    }
});
module.exports = mongoose.model('Message', messageSchema);