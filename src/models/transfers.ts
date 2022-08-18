/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

export type TransferType = 'baptise' | 'transferFrom' | 'transferTo' | 'excludedPermanently' | 'excludedTemporarely' | 'death';
export interface Transfer {
  owner: string;
  type: TransferType;
  date: Date;
  docNumber: string;
  churchTransfer: string;
  details: string;
}

const transferSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  type: {
    type: String,
    enum: ['baptise', 'transferFrom', 'transferTo', 'excludedPermanently', 'excludedTemporarely', 'death'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  docNumber: String,
  churchTransfer: String,
  details: String,
});

transferSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;

    return currentObj;
  },
});

export default mongoose.model('Transfer', transferSchema);
