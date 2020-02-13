const Security = require('../security');
const Products = require('../models/menuItem');
const Cart= require('../services/cart');

module.exports = {
  add:  (req, res) => {
  let qty = parseInt(req.body.qty, 10);
  let product = parseInt(req.body.product_id, 10);
  if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Products.findOne({id: product}).then(prod => {
        Cart.addToCart(prod, qty);
        Cart.saveCart(req);
        console.log('Saved to cart');
        res.redirect('/api/menu');
        console.log(req);
    }).catch(err => {
       res.redirect('/api/menu');
       console.log('Cant add to cart. Could not find product.');
    });  

} else {
    res.redirect('/api/menu');
    console.log('cant add cart. Quantity should be grater than 0.');
}
},

update: (req, res) => {
    let ids = req.body.product_id;
    let qtys = req.body.qty;
    if(Security.isValidNonce(req.body.nonce, req)) {
        let cart = (req.session.cart) ? req.session.cart : null;
        let i = (!Array.isArray(ids)) ? [ids] : ids;
        let q = (!Array.isArray(qtys)) ? [qtys] : qtys;
        console.log('with cart', cart, i, q);
        Cart.updateCart(i, q, cart);
        res.redirect('/api/cart/read');
    } else {
        res.redirect('/api/menu');
    }
},

show: (req, res) => {
    console.log('cart display');
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    console.log('cart read is', cart);
    res.render('pages/cart', {
        pageTitle: 'Cart',
        cart: cart,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });

},

remove: (req,res) => {
    let id = req.params.id;
   if(/^\d+$/.test(id) && Security.isValidNonce(req.params.nonce, req)) {
        console.log('remove item');
        console.log("id to remove", id);
       let cart = Cart.removeFromCart(parseInt(id, 10), req.session.cart);
       console.log('cart after removal',cart);
       //res.redirect('/api/cart/read');
       res.render('pages/cart', {
        pageTitle: 'Cart',
        cart: cart,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });
   } else {
       res.redirect('/');
   }
},

empty: (req,res) => {
    if(Security.isValidNonce(req.params.nonce, req)) {
        Cart.emptyCart(req);
        console.log('empty cart');
        res.redirect('/api/cart/read');
    } else {
        res.redirect('/');
    }
}

}