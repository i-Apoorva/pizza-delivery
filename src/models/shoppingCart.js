const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
       items: Array,
       total: Number,
       createdAt: Date
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);