import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import cloudinaryStorageEngine from './cloudinaryStorageEngine';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorageEngine({ cloudinary });

const uploadMedia = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  },
});

const removeMedia = async (fileId: string) => {
  // TODO better error handling here. Maybe use this as a middleware?
  try {
    const res = await cloudinary.uploader.destroy(fileId);
    console.log('remove res', res);
  } catch (e) {
    console.log('error', e);
  }
};

export {
  uploadMedia,
  removeMedia,
};
