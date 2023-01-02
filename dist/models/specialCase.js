"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const specialCaseSchema = new mongoose_1.default.Schema({
    person: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('SpecialCase', specialCaseSchema);
