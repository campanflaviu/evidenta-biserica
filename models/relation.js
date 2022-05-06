const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  type: {
    type: String,
    enum: ['husband', 'wife', 'child', 'parent'],
    required: true,
  },
  startDate: Date,
  details: String,
});


relationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Relation', relationSchema);
