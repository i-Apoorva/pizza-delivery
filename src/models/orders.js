const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
       id: Number,
       items: Array,
       amount: Number,
       paymentSource: String,
       currency: String,
       status: String,
       email: String,
       date: Date

});

module.exports = mongoose.model('Order', OrderSchema );