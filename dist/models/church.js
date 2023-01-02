"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const mongoose_1 = __importDefault(require("mongoose"));
const churchSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});
churchSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        const currentObj = returnedObject;
        currentObj.id = currentObj._id.toString();
        delete currentObj._id;
        delete currentObj.__v;
        return currentObj;
    },
});
const Church = mongoose_1.default.model('Church', churchSchema);
exports.default = Church;
