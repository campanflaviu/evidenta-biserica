const express = require('express');
const { uploadMedia, removeMedia } = require('../services/mediaService');
const Member = require('../models/member');
const checkValidId = require('../utils/checkValidId');
const updateRelation = require('../utils/updateRelation');

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
  .post(uploadMedia.single('profileImage'), async (req, res) => {
    try {
      if (req.body.firstName?.length && req.body.lastName?.length) {
        const member = new Member({
          ...req.body,
          imagePath: req.file?.imagePath || null,
          imageId: req.file?.imageId || null,
        });
        const newMember = await member.save();
        // eslint-disable-next-line no-underscore-dangle
        res.status(200).json({ ...newMember?._doc });
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router
  .route('/:id')
  // get a member by id
  .get(checkValidId, async (req, res) => {
    try {
      let member = await Member.findById(req.params.id);
      // console.log('member', typeof member.relations[0]);
      if (typeof member.relations[0] !== 'string') {
        member = await member.populate({
          path: 'relations',
          populate: {
            path: 'relation',
            model: 'Relation',
            // select: '-owner' // exclude owner field (since we might have switched it)
            // - not used since we use the owner for calculations
            // I don't think this is needed since we already have the list on FE
            // populate: {
            //   path: 'owner',
            //   select: 'firstName lastName',
            //   model: 'Member'
            // }
          },
        });
      }
      if (!member) {
        res.sendStatus(404);
      } else {
        // update relationship type
        member.relations = member.relations.map(updateRelation);
        res.json(member);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // delete a member by id
  .delete(checkValidId, async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      // remove cloudinary reference if present
      if (member.imageId) {
        await removeMedia(member.imageId);
      }
      await member.remove();
      res.sendStatus(204);
    } catch (e) {
      res.json({ error: e.message });
    }
  })
  // update a memmber by id
  .patch(checkValidId, uploadMedia.single('profileImage'), async (req, res) => {
    try {
      // we should check if there is an image uploaded, so we should delete it after we replace it
      const member = await Member.findById(req.params.id);
      console.log('relations', req.body.relations, req.body.relations.length);
      let memberData = req.body;
      if (req.file?.imagePath && req.file?.imageId) {
        await removeMedia(member.imageId);
        memberData = {
          ...req.body,
          imagePath: req.file.imagePath,
          imageId: req.file.imageId,
        };
      }

      const updatedMember = await Member.findByIdAndUpdate(req.params.id, memberData, {
        new: true,
      });
      res.json(updatedMember);
    } catch (e) {
      res.json({ error: e.message });
    }
  });

module.exports = router;
