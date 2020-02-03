require('dotenv').config();
var express = require('express');
var app  = express(); 
var bodyParser = require('body-parser');
const logger = require('morgan');
var mongoose   = require('mongoose'); 
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const axios = require('axios');
const router = express.Router();
var path = require('path');
var routes = require('./router');
const Security = require('./security');
const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];
var mongoDB =String(process.env.DB_URL);
const store = new MongoDBStore({
  uri: String(process.env.DB_URL),
  collection: 'sessions'
});

app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: true,
  store: store,
  unset: 'destroy',
  name: 'session cookie name'
}));

app.use(bodyParser.urlencoded({useNewUrlParser: true, extended: true} ));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (environment !== 'production') {
  app.use(logger('dev'));
}

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
  });

// app.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });  
//     // if(!req.session.test) {
//     //   req.session.test = 'OK';
//     //   res.send('OK');
//     // } 
// });

app.get('/', function(req, res) {
  res.render('pages/index');
});



app.get('/menu', function(req, res) {
  res.render('pages/menu');
})

app.get('/test', (req, res) => {
  res.send(req.session.test); // 'OK'
});

app.post('/test', (req, res) => {
  let token = req.body.nonce;
  if(Security.isValidNonce(token, req)) {
    // OK
  } else {
    // Reject the request
  }
});

app.use('/api/', routes);
// app.use((err, request, response, next) => {
//   // your logic to send error
// req.flash('error_msg', mappingFile[err.message]); // mapping file is key value pair of code and user friendly messages
// });


app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;