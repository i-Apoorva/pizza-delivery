var User= require('../models/users');
const validateToken = require('../utils').validateToken;
const Security = require('../security');

module.exports = {
    get: (req,res) => {
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
    },

    create: (req,res, next) => {
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
            res.render('pages/index',{ status: 200});
              
        }); 
    }

}