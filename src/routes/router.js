var User= require('../models/users');
var express = require('express');
var router = express.Router(); 
const bcrypt = require('bcrypt');
var mongoose   = require('mongoose');
const controller = require('../controllers/users.controller');
const validateToken = require('../utils').validateToken;
const jwt = require('jsonwebtoken');

router.get('/', function(req,res){ //for /api/
    res.send('API List!');

});

router.get('/user',validateToken, function(req,res){  // get all users info
    let result = {};
    let status = 200;
    mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
    if (!err) {
        const payload = req.decoded;
        // TODO: Log the payload here to verify that it's the same payload
        //  we used when we created the token
        console.log('PAYLOAD', payload);
        if (payload && payload.user === 'admin') {
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


router.get('/user/:userId', function(req,res){  // get specific user user
    User.findById(req.params.userId, (err, user) => {
        res.json(user)
    })  
});

router.post('/user', function(req, res){

    var user = new User();      
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.address = req.body.address;
        user.streetAddress = req.body.streetAddress;
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'New pizza user created!' });
        });
});

router.put('/user/:userId', function(req, res) {
    User.findById(req.params.userId, (err, user) => {
        user.name = req.body.name ? req.body.name :user.name ;
        user.email = req.body.email ? req.body.email: user.email;
        user.password = req.body.password ? req.body.password: user.password;
        user.address = req.body.address ? req.body.address: user.address ;
        user.streetAddress = req.body.streetAddress ? req.body.streetAddress : user.streetAddress;
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

router.route('/login')
 .post(controller.login)



module.exports = router;