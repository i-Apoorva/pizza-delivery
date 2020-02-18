var User= require('./models/users');
var express = require('express');
var router = express.Router(); 
const bcrypt = require('bcrypt');
const csrf= require('csurf');
var csrfProtection= csrf();
var mongoose   = require('mongoose');
const UserController = require('./controllers/user.controller');
const LoginController = require('./controllers/login.controller.js');
const MenuController = require('./controllers/menu.controller');
const CartController = require('./controllers/cart.controller');
const CheckoutController = require('./controllers/checkout.controller');
const validateToken = require('./utils').validateToken;
const jwt = require('jsonwebtoken');
router.use(csrfProtection);

router.get('/', function(req,res){ //for /api/
    res.send('API List!');

});

router.route('/users')
   .get(UserController.get,validateToken )


router.get('/user/create', csrfProtection,function(req,res, next){
    res.render('pages/userAccountCreate', {csrfToken: req.csrfToken()});
    console.log('user create');
})

router.get('/user/login',function(req,res){
    res.render('pages/login');
    console.log('login');
})


router.get('/user/:userId', function(req,res){  // get specific user user
    User.findById(req.params.userId, (err, user) => {
        res.json(user)
    })  
});

router.get('/user/profile', function(req,res){
    res.render('pages/userProfile');
});

router.route('/user/create')
     .post(UserController.create)
     

router.put('/user/:userId', function(req, res) {
    User.findById(req.params.userId, (err, user) => {
        user.name = req.body.name ? req.body.name :user.name ;
        user.email = req.body.email ? req.body.email: user.email;
        user.password = req.body.password ? req.body.password: user.password;
        user.address = req.body.address ? req.body.address: user.address ;
        user.streetAddress = req.body.streetAddress ? req.body.streetAddress : user.streetAddress;
        user.updatedAt = new Date();
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User info updated!' });
        });
    }) 
});

router.delete('/user/:userId', function(req, res) {
    User.findById(req.params.userId, (err, user) => {
        user.remove(err => {
            if(err){
                res.status(500).send(err)
            }
            else{
                res.json({ message: 'User deleted!' });  
            }
        })
    })
});

router.route('/login/tokens')
 .post(LoginController.login)

 router.get('/login', function(req,res) {
     res.render('pages/login');
 })

 router.route('/menu')
  .get(MenuController.getMenu)

router.route('/cart/update')
   .post(CartController.update)

router.route('/cart')
    .post(CartController.add)

router.route('/cart/read')
    .get(CartController.show)

router.route("/cart/remove/:id/:nonce")
    .get(CartController.remove)

router.route('/cart/empty/:nonce')
    .get(CartController.empty)

router.route('/checkout')
    .get(CheckoutController.read)
    .post(CheckoutController.post)




module.exports = router;