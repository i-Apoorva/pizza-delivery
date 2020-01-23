var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    email: String,
    address: String,
    streetAddress: String
});

module.exports = mongoose.model('User', UserSchema); 