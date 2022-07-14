import express from 'express';
import checkValidId from '../utils/checkValidId';
import SpecialCaseModel from '../models/specialCase';
import { addNewSpecialCase } from '../services/specialCaseService';

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try {
      const specialCases = await SpecialCaseModel.find();
      res.json(specialCases);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  .post(async (req, res) => {
    try {
      await addNewSpecialCase(req.body);
      res.sendStatus(201);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  });

router
  .route('/:id')
  .get(checkValidId, async (req, res) => {
    try {
      const specialCase = await SpecialCaseModel.findById(req.params.id);
      if (!specialCase) {
        res.sendStatus(404);
      } else {
        res.json(specialCase);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  .delete(checkValidId, async (req, res) => {
    try {
      const response = await SpecialCaseModel.findByIdAndDelete(req.params.id);
      if (response) {
        res.sendStatus(204);
      } else {
        // already deleted, or it doesn't exist
        res.sendStatus(404);
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  .patch(checkValidId, async (req, res) => {
    try {
      const updatedSpecialCase = await SpecialCaseModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      res.json(updatedSpecialCase);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  });

export default router;
