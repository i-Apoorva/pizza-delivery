const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
       name: String,
       email: String,
       token: String

});

module.exports = mongoose.model('Token', TokenSchema );