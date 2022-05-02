const mongoose = require('mongoose');

// available roles should be: admin, user, member
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Role', roleSchema);
