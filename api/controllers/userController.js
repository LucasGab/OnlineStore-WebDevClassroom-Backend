'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
User = mongoose.model('User');

exports.register = function(req,res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.password = undefined;
      return res.status(201).json(user);
    }
  });
};

exports.sign_in = function(req, res) {
  User.findOne({email: req.body.email },function(err, user) {
    if (err)  console.log(err);
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({message: 'Authentication failed. Invalid user or password.'});
    }
    user.password = undefined;
    return res.json({ 
      access_token: jwt.sign({ email: user.email, name: user.name, _id: user._id }, 'BOOK_STORE_KEY'),
      user: user
    });
  })
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};