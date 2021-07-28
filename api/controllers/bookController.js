'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
Book = mongoose.model('Book');

exports.frontbooks = function(req,res) {
  Book.find({},function(err, books) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      return res.json(books);
    }
  });
};

exports.book = function(req,res) {
  const bookname = req.params.name;
  if (!bookname || bookname === "") {
    return res.status(404).send({ message: 'Book not found' });
  }

  Book.findOne({ name: bookname },function(err, book) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      return res.json(book);
    }
  });
};