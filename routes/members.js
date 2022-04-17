const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const path = require('path');
const Member = require('../models/member');

const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  // this saves the image in local file system
  // storage: multer.diskStorage({
  //   destination: (req, file, callback) => {
  //     callback(null, path.join('public', Member.imageBasePath));
  //   },
  //   filename: (req, file, callback) => {
  //   // set filename as unix timestamp + existing filename
  //     callback(null, `${Date.now()}.${file.mimetype.split('image/').join('')}`);
  //   },
  // }),
  // this doesn't save the file, but prepares it for cloudinary
  storage: multer.diskStorage({}),
  fileFilter: (req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  }
});

const getMemberData = async (req) => {
  let hasFile = !!req.file;
  let memberData = req.body;
  // TODO add date and other needed fields

  // make member image optional
  if (hasFile) {
    const result = await cloudinary.uploader.upload(req.file.path);
    memberData = {
      ...memberData,
      profileImage: result.secure_url,
      cloudinaryId: result.public_id,
    }
  }
  return memberData;
};

router
  .route('/')
  // get all members
  .get(async (req, res) => {
    try {
      const members = await Member.find();
      res.json(members);
    } catch {
      res.json({ error: 'error' });
    }
  })
  // add a new memmber
  .post(upload.single('profile_image'), async (req, res) => {

    try {
      const member = new Member(await getMemberData(req));
      const newMember = await member.save();
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  });

router
  .route('/:id')
  // get a member by id
  .get(async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member) {
        res.status(404).json({ status: 'Member not found'})
      } else {
        res.json(member);
      }
    } catch (e) {
      console.error(e);
      res.status(404).json({ error: e.message });
    }
  })
  // delete a member by id
  .delete(async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      await cloudinary.uploader.destroy(member.cloudinaryId);
      await member.remove();

      res.json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  })
  // update a memmber by id
  .patch(upload.single('profile_image'), async (req, res) => {
    try {
      const memberData = await getMemberData(req);
      const updatedMember = await Member.findByIdAndUpdate(req.params.id, memberData, { new: true });
      res.json(updatedMember);
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });      
    }
  });

module.exports = router;
