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
        res.redirect('api/cart');
    }).catch(err => {
       res.redirect('/api/menu');
       console.log('cant add cart');
    });
} else {
    res.redirect('/api/menu');
    console.log('cant add cart');
}
},

update: (req, res) => {
    let ids = req.body["product_id[]"];
    let qtys = req.body["qty[]"];
    if(Security.isValidNonce(req.body.nonce, req)) {
        let cart = (req.session.cart) ? req.session.cart : null;
        let i = (!Array.isArray(ids)) ? [ids] : ids;
        let q = (!Array.isArray(qtys)) ? [qtys] : qtys;
        Cart.updateCart(i, q, cart);
        res.redirect('/api/cart');
    } else {
        res.redirect('/api/menu');
    }
},

show: (req, res) => {
    console.log('cart display');
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('pages/cart', {
        pageTitle: 'Cart',
        cart: cart,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });

},

remove: (req,res) => {
    let id = req.params.id;
   if(/^\d+$/.test(id) && Security.isValidNonce(req.params.nonce, req)) {
       Cart.removeFromCart(parseInt(id, 10), req.session.cart);
       res.redirect('/cart');
   } else {
       res.redirect('/');
   }
},

empty: (req,res) => {
    if(Security.isValidNonce(req.params.nonce, req)) {
        Cart.emptyCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
}

}