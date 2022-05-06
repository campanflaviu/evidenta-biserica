/* eslint-disable no-underscore-dangle */
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
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;

    return currentObj;
  },
});

module.exports = mongoose.model('Relation', relationSchema);
