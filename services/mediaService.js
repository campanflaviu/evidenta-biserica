const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cloudinaryStorageEngine = require('./cloudinaryStorageEngine');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorageEngine({ cloudinary: cloudinary });

const uploadMedia = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  }
});

const removeMedia = async (fileId) => {
  console.log(fileId);
  // TODO better error handling here. Maybe use this as a middleware?
  try {
    const res = await cloudinary.uploader.destroy(fileId);
    console.log('remove res', res);

  } catch (e) {
    console.log('error', e);
  }
}

module.exports = {
  uploadMedia,
  removeMedia,
};
