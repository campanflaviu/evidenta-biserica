const mongoose = require('mongoose');
const church = require('./church');
const relation = require('./relation');

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
  details: String,
  relations: [{
    relation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: relation,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: true,
    }
  }],
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: church
  },
});

memberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    // remove relation owner - not needed on FE since it's tied to it's owner
    returnedObject.relations = returnedObject.relations.map(rel => {
      delete rel.relation.owner;
      rel = rel.relation;
      return rel;
    })
  }
});

module.exports = mongoose.model('Member', memberSchema);
