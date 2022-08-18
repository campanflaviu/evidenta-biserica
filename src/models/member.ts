/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { Relation } from './relation';
import { Transfer } from './transfers';

export interface MemberRelation {
  relation: Relation;
  isOwner: boolean;
}

export interface MemberImage extends Express.Multer.File {
  imagePath: string;
  imageId: string;
}

export interface Member {
  address: string;
  firstName: string;
  lastName: string;
  maidenName: string;
  fatherName: string;
  motherName: string;
  birthDate: Date;
  placeOfBirth: string;
  cnp: string;
  sex: Boolean;
  homePhone: string;
  mobilePhone: string;
  email: string;
  deathDate: Date;
  details: string;
  registerDate: Date;
  imagePath: string;
  imageId: string;
  blessingDate: Date;
  blessingPlace: string;
  baptiseDate: Date;
  baptisePlace: string;
  hsBaptiseDate: Date;
  hsBaptisePlace: string;
  memberDate: Date;
  leaveDate: Date;
  relations: MemberRelation[];
  transfers: Transfer[];
  church: string;
}

const memberSchema = new mongoose.Schema({
  address: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  maidenName: String,
  fatherName: String,
  motherName: String,
  birthDate: Date,
  placeOfBirth: String,
  cnp: String,
  sex: Boolean,
  homePhone: String,
  mobilePhone: String,
  email: String,
  deathDate: Date,
  details: String,
  registerDate: Date,
  imagePath: String,
  imageId: String,
  blessingDate: Date,
  blessingPlace: String,
  baptiseDate: Date,
  baptisePlace: String,
  hsBaptiseDate: Date,
  hsBaptisePlace: String,
  memberDate: Date,
  leaveDate: Date,
  observations: String,
  relations: [{
    relation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Relation',
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: true,
    },
  }],
  transfers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transfer',
    required: true,
  }],
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
  },
});

memberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const currentObj = returnedObject;
    currentObj.id = currentObj._id.toString();
    delete currentObj._id;
    delete currentObj.__v;

    // remove relation owner - not needed on FE since it's tied to it's owner
    // TODO fix this type
    currentObj.relations = currentObj.relations
      // remove any empty relations, but we should avoid this from happening though
      .filter((rel: any) => rel.relation)
      .map((rel: any) => {
        let currentRel = rel;
        delete currentRel.relation?.owner;
        currentRel = currentRel.relation;
        return currentRel;
      });

    return currentObj;
  },
});

export default mongoose.model('Member', memberSchema);
