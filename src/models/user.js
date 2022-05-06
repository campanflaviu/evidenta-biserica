/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const role = require('./role');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: role,
  }],
  created: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;
    // hide password hash
    delete currentObj.password;

    return currentObj;
  },
});

module.exports = mongoose.model('User', userSchema);
