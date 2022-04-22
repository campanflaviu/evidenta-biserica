const mongoose = require('mongoose');
const church = require('./church');

const imageBasePath = 'uploads/memberProfileImages/';

const memberSchema = new mongoose.Schema({
  address: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  maidenName: String,
  fatherName: String,
  motherName: String,
  birthDate: Date,
  placeOfBirth: String,
  cnp: String,
  sex: Boolean,
  homePhone: String,
  mobilePhone: String,
  email: String,
  deathDate: Date,
  details: String,
  registerDate: Date,
  imagePath: String,
  imageId: String,
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: church
  },
});

module.exports = mongoose.model('Member', memberSchema);
module.exports.imageBasePath = imageBasePath;
