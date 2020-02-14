const Security = require('../security');

module.exports= {
    read: (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
<<<<<<< HEAD
        console.log('checkout', req.session);
=======
        console.log('cart', cart);
>>>>>>> 9d62996be25a4be7922f8d911bd927a7c464eb32
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
        res.render('checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: true
        });
    } else {
        res.redirect('/');
    } 
    }
}