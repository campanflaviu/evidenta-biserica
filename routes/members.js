const express = require('express');
const path = require('path');
const { uploadMedia, removeMedia } = require('../services/mediaService');
const Member = require('../models/member');
const checkValidId = require('../utils/checkValidId');

const router = express.Router();

router
  .route('/')
  // get all members
  .get(async (req, res) => {
    try {
      const members = await Member.find();
      res.json(members);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // add a new memmber
  .post(uploadMedia.single('profile_image'), async (req, res) => {
    try {
      if (req.body.firstName?.length && req.body.lastName?.length) {
        const member = new Member({
          ...req.body,
          imagePath: req.file?.imagePath || null,
          imageId: req.file?.imageId || null,
        });
        const newMember = await member.save();
        res.status(200).json({ ...newMember?._doc });
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });


router
  .route('/:id')
  // get a member by id
  .get(checkValidId, async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member) {
        res.sendStatus(404);
      } else {
        res.json(member);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  })
  // delete a member by id
  .delete(checkValidId, async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      // remove cloudinary reference if present
      if (member.imageId) {
        // await cloudinary.uploader.destroy(member.cloudinaryId);
        await removeMedia(member.imageId);
      }
      await member.remove();
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  })
  // update a memmber by id
  .patch(checkValidId, uploadMedia.single('profile_image'), async (req, res) => {
    try {
      // we should check if there is an image uploaded, so we should delete it after we replace it
      const member = await Member.findById(req.params.id);
      if (member.imageId) {
        await removeMedia(member.imageId);
      }

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
