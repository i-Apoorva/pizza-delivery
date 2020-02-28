require('dotenv').config();
var express = require('express');
var app  = express(); 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
var mongoose   = require('mongoose'); 
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash= require('connect-flash');
var path = require('path');
var routes = require('./router');
var CartRoutes= require('./controllers/cart.controller');
const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];
var mongoDB =String(process.env.DB_URL);
const store = new MongoDBStore({
  uri: String(process.env.DB_URL),
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({useNewUrlParser: true, extended: true} ));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: "my-secret-sesssion",
  resave: false,
  saveUninitialized: false,
  store: store,
  unset: 'destroy',
  name: 'session cookie name',
  cookie: { maxAge: 180 * 60 * 1000 }
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
  });

  app.use(function(req, res, next) {
    //res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/cart', CartRoutes);
app.use('/', routes);

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;