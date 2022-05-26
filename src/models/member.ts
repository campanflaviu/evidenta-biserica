/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

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
    currentObj.relations = currentObj.relations.map((rel: any) => {
      let currentRel = rel;
      delete currentRel.relation?.owner;
      currentRel = currentRel.relation;
      return currentRel;
    });

    return currentObj;
  },
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
