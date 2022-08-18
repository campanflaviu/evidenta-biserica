import express from 'express';
import TransferModel from '../models/transfers';
import checkValidId from '../utils/checkValidId';
import { addNewTransfer, deleteTransferById } from '../services/transferService';

const router = express.Router();

router
  .route('/')
  // get all transfers (I don't think we need this in prod)
  .get(async (req, res) => {
    try {
      const transfers = await TransferModel.find();
      res.json(transfers);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  })
  // add a new transfer
  // TODO - validate relation type
  .post(async (req, res) => {
    // TODO validation middleware for required fields
    if (req.body.owner?.length && req.body.type?.length && req.body.date?.length) {
      try {
        // save transfer
        await addNewTransfer(req.body);
        res.sendStatus(201);
      } catch (e) {
        if (e instanceof Error) {
          res.status(500).json({ error: e.message });
        }
      }
    } else {
      console.log('aici');
      res.sendStatus(400); // bad request
    }
  });

router
  .route('/:id')
  // get a transfer by id
  .get(checkValidId, async (req, res) => {
    try {
      const transfer = await TransferModel.findById(req.params.id);
      if (!transfer) {
        res.sendStatus(404);
      } else {
        res.json(transfer);
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
      const response = await deleteTransferById(req.params.id);
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
  });
// update a relation by id
// .patch(checkValidId, async (req, res) => {
//   try {
//     const updatedRelation = updateRelationById(req.params?.id, req.body);
//     res.json(updatedRelation);
//   } catch (e) {
//     if (e instanceof Error) {
//       res.status(500).json({ error: e.message });
//     }
//   }
// });

export default router;
