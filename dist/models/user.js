"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('User', userSchema);
