const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: 'String',
    //required: true,
    trim: true
  },
  email: String,
  address: String,
  streetAddress: String,
  createdAt: Date,
  updatedAt: Date
});


// encrypt password before save
UserSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
      next();
    } else {
      bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
        if (err) {
          console.log('Error hashing password for user', user.name);
          next(err);
        } else {
          user.password = hash;
          next();
        }
      });
    }
  });

module.exports = mongoose.model('User', UserSchema, 'users');