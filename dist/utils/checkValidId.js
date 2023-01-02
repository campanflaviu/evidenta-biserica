"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const checkValidId = (req, res, next) => {
    if (mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next();
    }
    return res.sendStatus(404);
};
exports.default = checkValidId;
