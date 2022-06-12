/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { Role } from './role';

export interface User {
  email: string;
  password: string;
  roles: Role[],
  created: Date
}

export interface UserRelation {
  person: string;
  type: 'husband' | 'wife' | 'child' | 'parent';
  civilWeddingDate: Date;
  weddingChurch: string;
  childBirthDate: Date;
  details: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  created: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;
    // hide password hash
    delete currentObj.password;

    return currentObj;
  },
});

export default mongoose.model('User', userSchema);
