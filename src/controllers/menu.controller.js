var mongoose   = require('mongoose');
var Menu = require('../models/menuItem');

module.exports = {
    getMenu: (req, res) => {
      let result = {};
    let status = 200;
    mongoose.connect(String(process.env.DB_URL), { useNewUrlParser: true }, (err) => {
    if (!err) {
        const payload = req.decoded;
        // TODO: Log the payload here to verify that it's the same payload
        //  we used when we created the token
        console.log('PAYLOAD', payload);
        if (payload) {
          Menu.find({}, (err, users) => {
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
      
        
}
}

