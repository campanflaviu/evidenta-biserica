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
    ref: role
  }],
  created: {
    type: Date,
    default: Date.now(),
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // hide password hash
    delete returnedObject.password;
  }
});

module.exports = mongoose.model('User', userSchema);
