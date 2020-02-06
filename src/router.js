var User= require('./models/users');
var express = require('express');
var router = express.Router(); 
const bcrypt = require('bcrypt');
var mongoose   = require('mongoose');
const LoginController = require('./controllers/login.controller.js');
const MenuController = require('./controllers/menu.controller');
const CartController = require('./controllers/cart.controller');
const validateToken = require('./utils').validateToken;
const jwt = require('jsonwebtoken');

router.get('/', function(req,res){ //for /api/
    res.send('API List!');

});

router.get('/users',validateToken, function(req,res){  // get all users info
    let result = {};
    let status = 200;
    mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
    if (!err) {
        const payload = req.decoded;
        console.log('PAYLOAD', payload);
        if (payload && payload.user === 'admin@gmail.com') {
          User.find({}, (err, users) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = users;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        } else {
          status = 401;
          result.status = status;
          result.error = `Authentication error`;
          res.status(status).send(result);
        }
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
});

router.get('/user/create',function(req,res){
    res.render('pages/userAccountCreate');
    console.log('usercreate');
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

router.post('/user/create',function(req, res, next){

    var user = new User();      
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.address = req.body.address;
        user.streetAddress = req.body.streetAddress;
        user.createdAt= new Date();
        user.updatedAt= new Date();
        user.save(function(err) {
            if (err) {
                if (err.code == 11000 && err.message.indexOf('users.$email_1') > -1) 
                    res.json({message: 'user already exists'});
                   next();
                
            }
            res.render('pages/index');
              
        });
});

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




module.exports = router;