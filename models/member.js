const mongoose = require('mongoose');
const church = require('./church');

const imageBasePath = 'uploads/memberProfileImages/';

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: String,
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
