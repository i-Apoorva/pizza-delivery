const bcrypt = require('bcrypt');
var mongoose   = require('mongoose');
var User= require('../models/users');
const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res) => {
        const { email, password } = req.body;
        console.log("body",req.body);
        mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
          console.log("body",req.body);
          let result = {};
          let status = 200;
          var isAuthenicated= false;
          if(!err) {
            User.findOne({email}, (err, user) => {
              if (!err && user) {
                bcrypt.compare(password, user.password).then(match => {
                  if (match) {
                    // Create a token
                    console.log(req.session);
                    const payload = { user: user.email };
                    const options = { expiresIn: '2d', issuer: 'https://apoorva.io' };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                    console.log('TOKEN', token);
                    result.token = token;
                    result.status = status;
                    result.result = user;
                    console.log(req.session);
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                  }

                  res.render('pages/index', {
                     result: result,
                     status: status
                  });

                  // res.status(status).send(result);
                  
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