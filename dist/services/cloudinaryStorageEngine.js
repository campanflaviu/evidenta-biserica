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
/* eslint-disable @typescript-eslint/naming-convention */
function CloudinaryStorage(opts) {
    this.cloudinary = opts.cloudinary || null;
    this.uploadOptions = opts.uploadOptions || {};
    this.destroyOptions = opts.destroyOptions || {};
}
// eslint-disable-next-line no-underscore-dangle
CloudinaryStorage.prototype._handleFile = function _handleFile(req, file, cb) {
    try {
        if (!this.cloudinary) {
            return new Error('"cloudinary" is a required field.');
        }
        const uploadStream = this.cloudinary.uploader.upload_stream(Object.assign({}, this.uploadOptions), (err, result) => {
            if (err) {
                cb(err);
            }
            else {
                cb(null, {
                    imagePath: result.secure_url,
                    imageId: result.public_id,
                });
            }
        });
        file.stream.pipe(uploadStream);
        return true;
    }
    catch (error) {
        return cb(error);
    }
};
// eslint-disable-next-line no-underscore-dangle
CloudinaryStorage.prototype._removeFile = function _removeFile(req, file, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield this.cloudinary.uploader.destroy(Object.assign({}, this.destroyOptions));
            return cb(null, true);
        }
        catch (error) {
            return cb(error);
        }
    });
};
module.exports = (opts) => new CloudinaryStorage(opts);
