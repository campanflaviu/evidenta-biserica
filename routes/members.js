const express = require('express');
const multer = require('multer');
const path = require('path');
const Member = require('../models/member');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join('public', Member.imageBasePath));
    },
    filename: (req, file, callback) => {
    // set filename as unix timestamp + existing filename
      callback(null, `${Date.now()}.${file.mimetype.split('image/').join('')}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  }
});

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
    const fileName = req.file != null ? req.file.filename : null;
    console.log(fileName, req.body);
    const member = new Member({
      ...req.body,
      profileImage: fileName // TODO move images to cloudinary
      // TODO add date and other needed fields
    });

    try {
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
      await Member.findByIdAndDelete(req.params.id);
      res.json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  })
  // update a memmber by id
  .patch(async (req, res) => {
    try {
      const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedMember);
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });      
    }
  });

module.exports = router;
