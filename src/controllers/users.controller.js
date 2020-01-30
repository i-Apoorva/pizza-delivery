const bcrypt = require('bcrypt');
var mongoose   = require('mongoose');
var User= require('../models/users');
const jwt = require('jsonwebtoken');

module.exports = {
    // add: (req, res) => {
    //   return;
    // }

    login: (req, res) => {
        const { name, password } = req.body;
        console.log("body",req.body);
    
        mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
          let result = {};
          let status = 200;
          if(!err) {
            User.findOne({name}, (err, user) => {
              if (!err && user) {
                bcrypt.compare(password, user.password).then(match => {
                  if (match) {
                    // Create a token
                    const payload = { user: user.name };
                    const options = { expiresIn: '2d', issuer: 'https://apoorva.io' };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                    
                    console.log('TOKEN', token);
                    result.token = token;
                    result.status = status;
                    result.result = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                  }
                  res.status(status).send(result);
                }).catch(err => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                });
              } else {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
              }
            });
          } else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
      }
  }