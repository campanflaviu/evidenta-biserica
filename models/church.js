const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema({
  name: String,
  address: String,
});

module.exports = mongoose.model('Church', churchSchema);