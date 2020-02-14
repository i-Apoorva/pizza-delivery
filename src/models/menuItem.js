const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
       id: Number,
       name: String,
       price: Number,
       image: String

});

module.exports = mongoose.model('menuItem', MenuItemSchema , 'menuItems' );