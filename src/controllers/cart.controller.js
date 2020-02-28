var express = require('express');
var router = express.Router();
const Security = require('../security');
const shoppingCart = require('../models/shoppingCart');
const Product= require('../models/menuItem');
const Cart= require('../services/cart');

router.get('/add-to-cart/:id', function(req, res, next) {
    console.log('add to cart function');
    console.log('req params-->', req.params.id);
    console.log('session cart', req.session.cart);
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    console.log('session cart now is-->', cart);
    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product._id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/menu');
    })
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart/show-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart/show-cart');
});

router.get('/show-cart', function(req, res) {
   if (!req.session.cart) {
       console.log('no cart');
       return res.render('pages/cart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    console.log('cart created');
    res.render('pages/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


module.exports = router;