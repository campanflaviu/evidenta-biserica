const express = require('express');
const path = require('path');
const { uploadMedia, removeMedia } = require('../services/mediaService');
const Member = require('../models/member');

const router = express.Router();

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
  .post(uploadMedia.single('profile_image'), async (req, res) => {
    try {
      const member = new Member({
        ...req.body,
        imagePath: req.file?.imagePath || null,
        imageId: req.file?.imageId || null,
      });
      const newMember = await member.save();
      res.status(200).json({ ...newMember?._doc });
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
      // remove cloudinary reference if present
      if (member.imageId) {
        // await cloudinary.uploader.destroy(member.cloudinaryId);
        await removeMedia(member.imageId);
      }
      await member.remove();

      res.json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  })
  // update a memmber by id
  .patch(uploadMedia.single('profile_image'), async (req, res) => {
    try {
      // TODO handle image update: it should remove the old one and upload new
      const memberData = {
        ...req.body,
        imagePath: req.file?.imagePath || null,
        imageId: req.file?.imageId || null,
      };
      const updatedMember = await Member.findByIdAndUpdate(req.params.id, memberData, { new: true });
      res.json(updatedMember);
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });      
    }
  });

module.exports = router;
