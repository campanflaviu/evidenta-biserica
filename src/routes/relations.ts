import express from 'express';
import Relation from '../models/relation';
import Member from '../models/member';
import checkValidId from '../utils/checkValidId';

const router = express.Router();

router
  .route('/')
  // get all relations (I don't think we need this in prod)
  .get(async (req, res) => {
    try {
      const relations = await Relation.find();
      res.json(relations);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // add a new relation
  // TODO - validate relation type
  .post(async (req, res) => {
    // TODO validation middleware for required fields
    if (req.body.owner?.length && req.body.person?.length && req.body.type?.length) {
      try {
        // save relation
        const relation = new Relation(req.body);
        await relation.save();

        // add relation to owner
        const owner = await Member.findById({ _id: req.body.owner });
        owner.relations.push({
          relation,
          isOwner: true,
        });
        await owner.save();

        // add relation to other person
        const otherPerson = await Member.findById(req.body.person);
        otherPerson.relations.push({
          relation,
          isOwner: false,
        });
        await otherPerson.save();

        res.sendStatus(204);
      } catch (e) {
        if (e instanceof Error) {
          res.status(500).json({ error: e.message });
        }
      }
    } else {
      res.sendStatus(400); // bad request
    }
  });

router
  .route('/:id')
  // get a relation by id
  .get(checkValidId, async (req, res) => {
    try {
      const relation = await Relation.findById(req.params.id);
      if (!relation) {
        res.sendStatus(404);
      } else {
        res.json(relation);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // delete a relation by id
  .delete(checkValidId, async (req, res) => {
    try {
      const resource = await Relation.findByIdAndDelete(req.params.id);
      if (resource) {
        res.sendStatus(204);
      } else {
        // already deleted
        res.sendStatus(404);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // update a relation by id
  .patch(checkValidId, async (req, res) => {
    try {
      const updatedRelation = await Relation.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updatedRelation);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  });

export default router;
