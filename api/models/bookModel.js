'use strict';
var mongoose = require('mongoose'), bcrypt = require('bcrypt'), Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
  name: {
    type:String
  },
  author: {
    type:String
  },
  imgUrl: {
    type:String
  },
  rating: {
    type:Number
  },
  qtdReview: {
    type:Number
  },
  price: {
    type:Number
  },
  description: {
    type:String
  }
}, { collection: 'books' });

mongoose.model('Book', BookSchema);