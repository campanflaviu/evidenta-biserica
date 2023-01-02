"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMedia = exports.uploadMedia = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinaryStorageEngine_1 = __importDefault(require("./cloudinaryStorageEngine"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = (0, cloudinaryStorageEngine_1.default)({ cloudinary: cloudinary_1.v2 });
exports.uploadMedia = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, callback) => {
        callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
    },
});
const removeMedia = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO better error handling here. Maybe use this as a middleware?
    try {
        const res = yield cloudinary_1.v2.uploader.destroy(fileId);
        console.log('remove res', res);
    }
    catch (e) {
        console.log('error', e);
    }
});
exports.removeMedia = removeMedia;
