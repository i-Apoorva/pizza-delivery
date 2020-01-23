require('dotenv').config();
var express = require('express');
var app  = express(); 
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var mongoose   = require('mongoose'); 
const axios = require('axios'); 
var routes = require('./routes/router');
var mongoDB =String(process.env.DB_URL);

app.use(bodyParser.urlencoded({useNewUrlParser: true, extended: true} ));
app.use(bodyParser.json());

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

app.listen(port);
console.log('Magic happens on port ' + port);