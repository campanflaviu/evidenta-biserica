"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const mongoose_1 = __importDefault(require("mongoose"));
const memberSchema = new mongoose_1.default.Schema({
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
    baptisedBy: String,
    hsBaptiseDate: Date,
    hsBaptisePlace: String,
    memberDate: Date,
    leaveDate: Date,
    observations: String,
    relations: [{
            relation: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Relation',
                required: true,
            },
            isOwner: {
                type: Boolean,
                default: true,
            },
        }],
    transfers: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Transfer',
            required: true,
        }],
    church: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            .filter((rel) => rel.relation)
            .map((rel) => {
            var _a;
            let currentRel = rel;
            (_a = currentRel.relation) === null || _a === void 0 ? true : delete _a.owner;
            currentRel = currentRel.relation;
            return currentRel;
        });
        return currentObj;
    },
});
exports.default = mongoose_1.default.model('Member', memberSchema);
