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
      },
    );
    file.stream.pipe(uploadStream);
    return true;
  } catch (error) {
    return cb(error);
  }
};

// eslint-disable-next-line no-underscore-dangle
CloudinaryStorage.prototype._removeFile = async function _removeFile(req, file, cb) {
  try {
    await this.cloudinary.uploader.destroy(
      { ...this.destroyOptions },
      // TODO what is this used for??
      // member.cloudinaryId,
    );
    return cb(null, true);
  } catch (error) {
    return cb(error);
  }
};

module.exports = (opts) => new CloudinaryStorage(opts);
