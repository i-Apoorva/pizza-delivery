const Security = require('../security');

module.exports= {
    read: (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
        console.log('checkout', req.session);
        console.log('cart', cart);
        res.render('pages/checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: false,
            nonce: Security.md5(req.sessionID + req.headers['user-agent'])
        });
    },

    post: (req, res) => {
        let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    if(Security.isValidNonce(req.body.nonce, req)) {
        res.render('pages/checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: true
        });
    } else {
        res.redirect('/');
    } 
    }
}