import express from 'express';
import RelationModel from '../models/relation';
import checkValidId from '../utils/checkValidId';
import { addNewRelation, deleteRelationById, updateRelationById } from '../services/relationService';

const router = express.Router();

router
  .route('/')
  // get all relations (I don't think we need this in prod)
  .get(async (req, res) => {
    try {
      const relations = await RelationModel.find();
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
        await addNewRelation(req.body);
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
      const relation = await RelationModel.findById(req.params.id);
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
      const response = await deleteRelationById(req.params.id);
      if (response) {
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
      const updatedRelation = updateRelationById(req.params?.id, req.body);
      res.json(updatedRelation);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  });

export default router;
