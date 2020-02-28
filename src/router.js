var express = require('express');
var router = express.Router();
const csrf= require('csurf');
var csrfProtection= csrf();
var User= require('./models/users');
const UserController = require('./controllers/user.controller');
const LoginController = require('./controllers/login.controller.js');
const MenuController = require('./controllers/menu.controller');
const CartController = require('./controllers/cart.controller');
const CheckoutController = require('./controllers/checkout.controller');
const validateToken = require('./utils').validateToken;
router.use(csrfProtection);

router.get('/', function(req,res){
    res.render('pages/index', {status: 200});
});

router.route('/userslist')
   .get(UserController.get,validateToken )


router.get('/user/create',function(req,res, next){
    res.render('pages/userAccountCreate', {csrfToken: req.csrfToken()});
    console.log('user create');
})

router.get('/user/login',function(req,res){
    res.render('pages/login', {csrfToken: req.csrfToken()});
})

router.get('/user/about', function(req,res){
    res.render('pages/userProfile');
});

router.get('/user/:userId', function(req,res){  // get specific user user
    User.findById(req.params.userId, (err, user) => {
        res.json(user)
    })  
});

router.route('/user/create')
     .post(UserController.create)
     

router.route('/user/:userId') 
    .put(UserController.update)

router.route('/user/:userId') 
     .delete(UserController.delete)

router.route('/user/login/tokens')
 .post(LoginController.login)

 router.route('/menu')
  .get(MenuController.getMenu)

// router.route('/cart/update')
//    .post(CartController.update)

// router.route('/cart')
//     .post(CartController.add)

// router.route('/cart/read')
//     .get(CartController.show)

// router.route("/cart/remove/:id/:nonce")
//     .get(CartController.remove)

// router.route('/cart/empty/:nonce')
//     .get(CartController.empty)

router.route('/checkout')
    .get(CheckoutController.read)
    .post(CheckoutController.post)


module.exports = router;