'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
User = mongoose.model('User'),
Book = mongoose.model('Book');

exports.tasks = function(req,res) {
  console.log(req.user);
}

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
    if (err)  {
      console.log(err);
      return res.status(400).json({ message: err });
    }
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

exports.wishList = function(req, res) {
  User.findOne({_id: req.user._id }).populate('bookWishList').exec(function(err, user) {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: err });
    }
    if(!user)
      return res.status(404).json({ message: 'User not found!' });

    res.status(200).json({ bookWishList: user.bookWishList });
  })
}

exports.addWishList = function(req, res) {
  const book_id = String(req.body.book_id);

  User.findOne({_id: req.user._id }).populate('bookWishList').exec(function(err, user) {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: err });
    }
    if(!book_id)
      return res.status(400).json({ message: 'Need book id!' });
    if(!user)
      return res.status(404).json({ message: 'User not found!' });

    Book.findOne({_id: book_id},function(err, book) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      }
      if (!book) 
        return res.status(404).json({ message: 'Book not found!' });
      user.bookWishList.push(book);
      user.save();
      res.status(201).json({ bookWishList: user.bookWishList })
    });
  })
}

exports.deleteWishList = function(req, res) {
  const book_id = String(req.params.book_id);
  
  User.findOne({_id: req.user._id }).populate('bookWishList').exec(function(err, user) {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: err });
    }
    if(!book_id)
      return res.status(400).json({ message: 'Need book id!' });
    if(!user)
      return res.status(404).json({ message: 'User not found!' });

    Book.findOne({_id: book_id},function(err, book) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      }
      if (!book) 
        return res.status(404).json({ message: 'Book not found!' });
      const index = user.bookWishList.findIndex((book) => String(book._id) === String(book_id));
      if (index >= 0) {
        user.bookWishList.splice(index,1);
      }
      user.save();
      res.status(200).json({ bookWishList: user.bookWishList })
    });
  })
}

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.user = function(req, res, next) {
  if (req.user) {
    const user = req.user;
    user.password = undefined;
    res.send(req.user);
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.modifyUser = function(req, res) {
  const id = String(req.params.id);
  User.findOne({_id: id },function(err, user) {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: err });
    }
    if(!id)
      return res.status(400).json({ message: 'Need user id!' });
    if(!user)
      return res.status(404).json({ message: 'User not found!' });

    if(req.body.name)
      user.name = String(req.body.name);
    
    if(req.body.password)
      user.password = bcrypt.hashSync(req.body.password, 10);

    user.save(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        user.password = undefined;
        return res.status(200).json(user);
      }
    });
  });
};