"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const mongoose_1 = __importDefault(require("mongoose"));
const relationSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    person: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Relation', relationSchema);
