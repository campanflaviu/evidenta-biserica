/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

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

const Church = mongoose.model('Church', churchSchema);
export default Church;
