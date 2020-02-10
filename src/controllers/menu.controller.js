var mongoose   = require('mongoose');
var Menu = require('../models/menuItem');
const validateToken = require('../utils').validateToken;
const Security = require('../security');

module.exports = {
    getMenu: (req, res) => {
    //   let result = {};
    // let status = 200;
    // mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
    // if (!err) {
    //     const payload = req.decoded;
    //     console.log('PAYLOAD', payload);
    //     if (payload) {
    //       Menu.find({}, (err, users) => {
    //         if (!err) {
    //           result.status = status;
    //           result.error = err;
    //           result.result = users;
    //         } else {
    //           status = 500;
    //           result.status = status;
    //           result.error = err;
    //         }
    //         //res.status(status).send(result);
    //         resp.render('pages/menu', result);
    //       });
    //     } else {
    //       status = 401;
    //       result.status = status;
    //       result.error = `Authentication error`;
    //       res.status(status).send(result);
    //     }
    //   } else {
    //     status = 500;
    //     result.status = status;
    //     result.error = err;
    //     res.status(status).send(result);
    //   }
    // });

    let products = {};
    let status = 200;

    mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
      if (!err) {
     
    Menu.find({}, (err, result) => {
      if (!err) {
        products.status = status;
        products.error = err;
        products.result = result;
        // console.log(products.result);
      } 
      // res.status(status).send(result);
      res.render('pages/menu',  {
        products: products.result,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
      });
      
    });
  }
});
        
}
}

