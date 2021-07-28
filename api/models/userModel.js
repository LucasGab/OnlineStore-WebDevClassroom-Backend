'use strict';
var mongoose = require('mongoose'), bcrypt = require('bcrypt'), Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
},{ collection: 'users' });

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', UserSchema);
