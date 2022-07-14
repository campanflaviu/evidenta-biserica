import mongoose from 'mongoose';

export interface SpecialCase {
  person: string;
  details: string;
  startDate: Date;
  endDate: Date;
}

const specialCaseSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  details: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
});

specialCaseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;

    return currentObj;
  },
});

export default mongoose.model('SpecialCase', specialCaseSchema);
