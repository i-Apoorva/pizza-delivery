const Security = require('../security');
const Products = require('../models/menuItem');
const Cart= require('../services/cart');

module.exports = {
  add:  (req, res) => {
  let qty = parseInt(req.body.qty, 10);
  let product = parseInt(req.body.product_id, 10);
  if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Products.findOne({product_id: product}).then(prod => {
        Cart.addToCart(prod, qty);
        Cart.saveCart(req);
        res.redirect('/cart');
    }).catch(err => {
       res.redirect('/');
    });
} else {
    res.redirect('/');
}
},

update: (req, res) => {
    let ids = req.body["product_id[]"];
let qtys = req.body["qty[]"];
if(Security.isValidNonce(req.body.nonce, req)) {
    Cart.updateCart(ids, qtys);
    Cart.saveCart(req);
    res.redirect('/cart');
} else {
    res.redirect('/');
}
},

show: (req, res) => {
    console.log('cart display');
    res.render('pages/cart');

}

}