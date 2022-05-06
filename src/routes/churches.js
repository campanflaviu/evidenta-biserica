const express = require('express');
const Church = require('../models/church');
const checkValidId = require('../utils/checkValidId');

const router = express.Router();

router
  .route('/')
  // get all churches
  .get(async (req, res) => {
    try {
      const churches = await Church.find();
      res.json(churches);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // add a new church
  .post(async (req, res) => {
    if (req.body.name?.length && req.body.address?.length) {
      const church = new Church({
        name: req.body.name,
        address: req.body.address,
      });

      try {
        await church.save();
        res.sendStatus(204);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    } else {
      res.sendStatus(400); // bad request
    }
  });

router
  .route('/:id')
  // get a church by id
  .get(checkValidId, async (req, res) => {
    try {
      const church = await Church.findById(req.params.id);
      if (!church) {
        res.sendStatus(404);
      } else {
        res.json(church);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // delete a church by id
  .delete(checkValidId, async (req, res) => {
    try {
      const resource = await Church.findByIdAndDelete(req.params.id);
      if (resource) {
        res.sendStatus(204);
      } else {
        // already deleted
        res.sendStatus(404);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // update a church by id
  .patch(checkValidId, async (req, res) => {
    try {
      const updatedChurch = await Church.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedChurch);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = router;
