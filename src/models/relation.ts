/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
// import { User } from './user';

export type RelationType = 'husband' | 'wife' | 'child' | 'parent';
export interface Relation {
  owner: string;
  person: string;
  type: RelationType;
  civilWeddingDate: Date;
  weddingChurch: string;
  childBirthDate: Date;
  details: string;
}

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
  civilWeddingDate: Date,
  religiousWeddingDate: Date,
  weddingChurch: String,
  childBirthDate: Date,
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

export default mongoose.model('Relation', relationSchema);
