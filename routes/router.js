var User= require('../models/users');
var express = require('express');
var router = express.Router(); 
var axios= require('axios');

router.get('/', function(req,res){
    res.send('API List!');
});

router.get('/user', function(req,res){
    res.send('USER INFO!');
});

router.post('/user', function(req, res){

    var user = new User();      
        user.name = req.body.name;
        user.email = req.body.email;
        user.address = req.body.address;
        user.streetAddress = req.body.streetAddress;
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'New pizza user created!' });
        });
});

module.exports = router;