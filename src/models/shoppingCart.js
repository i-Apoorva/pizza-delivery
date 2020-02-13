const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
       items: [],
       total: String,
       createdAt: Date

});

var ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema );
module.exports = {ShoppingCart};