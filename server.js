'use strict';

var express = require('express'),
cors = require('cors'),
app = express(),
port = process.env.PORT || 4000,
User = require('./api/models/userModel'),
Book = require('./api/models/bookModel'),
jsonwebtoken = require("jsonwebtoken");

app.use(express.json());
app.use(cors())
app.use('/public',express.static('public'))

const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const mongoURI = process.env.MONGODB_URI;
mongoose.connect('mongodb://localhost:27017/book_store', option).then(function(){
    //connected successfully
}, function(err) {
    //err handle
});

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'BOOK_STORE_KEY', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

var routesUser = require('./api/routes/userRoute');
routesUser(app);

var routesBook = require('./api/routes/bookRoute');
routesBook(app);


app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log('Server Started at ' + port);

module.exports = app;