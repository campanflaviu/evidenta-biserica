/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

churchSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;
    return currentObj;
  },
});

module.exports = mongoose.model('Church', churchSchema);
