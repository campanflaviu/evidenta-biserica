var fs = require('fs');

function CloudinaryStorage(opts) {
  this.cloudinary = opts.cloudinary || null;
  this.uploadOptions = opts.uploadOptions || {};
  this.destroyOptions = opts.destroyOptions || {};
};

CloudinaryStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  try {
    if (!this.cloudinary) {
      throw new Error('"cloudinary" is a required field.');
    }
    const uploadStream = this.cloudinary.uploader.upload_stream(
      { ...this.uploadOptions },
      (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(null, {
            imagePath: result.secure_url,
            imageId: result.public_id,
          });
        }
      }
    );
    file.stream.pipe(uploadStream);
  } catch (error) {
    return cb(error);
  }
};

CloudinaryStorage.prototype._removeFile = async function _removeFile(req, file, cb) {
  try {
    const res = await cloudinary.uploader.destroy(
      { ...this.destroyOptions },
      member.cloudinaryId,
    );
    return cb(null, true);
  } catch (error) {
    return cb(error);
  }
};

module.exports = (opts) => {
  return new CloudinaryStorage(opts)
};
