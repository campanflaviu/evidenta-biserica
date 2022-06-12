import express from 'express';

import { uploadMedia, removeMedia } from '../services/mediaService';
import { addNewMember, updateMemberById } from '../services/memberService';
import { updateMemberRelations } from '../services/relationService';
import MemberModel, { MemberImage } from '../models/member';
import checkValidId from '../utils/checkValidId';
import updateRelation from '../utils/updateRelation';

const router = express.Router();

interface CloudinaryFile extends Express.Multer.File {
  imagePath: string,
  imageId: string,
}

router
  .route('/')
  // get all members
  .get(async (req, res) => {
    try {
      const members = await MemberModel.find();
      res.json(members);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // add a new memmber
  .post(uploadMedia.single('profileImage'), async (req, res) => {
    try {
      const member = await addNewMember(req.body, req.file as MemberImage);
      if (member) {
        res.status(200).json({ ...member?._doc });
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  });

router
  .route('/:id')
  // get a member by id
  .get(checkValidId, async (req, res) => {
    try {
      let member = await MemberModel.findById(req.params.id);
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
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // delete a member by id
  .delete(checkValidId, async (req, res) => {
    try {
      const member = await MemberModel.findById(req.params.id);
      // remove cloudinary reference if present
      if (member.imageId) {
        await removeMedia(member.imageId);
      }
      await member.remove();
      res.sendStatus(204);
    } catch (e) {
      if (e instanceof Error) {
        res.json({ error: e.message });
      }
    }
  })
  // update a memmber by id
  .patch(checkValidId, uploadMedia.single('profileImage'), async (req, res) => {
    try {
      // if an image is sent, then the body should be in the doc obj
      const memberData = req.body?.doc ? JSON.parse(req.body?.doc) : req.body;
      const { relations, ...memberWithoutRelations } = memberData;

      // console.log('relations', relations);
      // console.log('member', memberWithoutRelations);
      const updateStatuses = await updateMemberRelations(req.params.id, relations);
      // console.log('update statuses', updateStatuses);

      const updatedMember = await updateMemberById(
        req.params.id,
        memberWithoutRelations,
        req.file as CloudinaryFile,
      );
      res.json({ ...updatedMember, relationStatuses: updateStatuses });
    } catch (e) {
      if (e instanceof Error) {
        res.json({ error: e.message });
      }
    }
  });

export default router;
