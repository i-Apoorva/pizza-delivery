require('dotenv').config();
var express = require('express');
var app  = express(); 
var bodyParser = require('body-parser');
const logger = require('morgan');
var mongoose   = require('mongoose'); 
const axios = require('axios');
const router = express.Router();
var routes = require('./routes/router');
const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];
var mongoDB =String(process.env.DB_URL);

app.use(bodyParser.urlencoded({useNewUrlParser: true, extended: true} ));
app.use(bodyParser.json());

if (environment !== 'production') {
  app.use(logger('dev'));
}

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
  });

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api/', routes);

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;