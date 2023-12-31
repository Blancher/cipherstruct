const mongoose = require('mongoose');

const cipherSchema = new mongoose.Schema({
    title: {type: String, requird: true},
    string: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    dislikes: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}]
});

module.exports = mongoose.model('Cipher', cipherSchema);