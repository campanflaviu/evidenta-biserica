const express = require('express');
const Church = require('../models/church');
const mongoose = require('mongoose');

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
        const newChurch = await church.save();
        res.sendStatus(204);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
      }
    } else {
      res.sendStatus(400); // bad request
    }
  });

router
  .route('/:id')
  // get a church by id
  .get(async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const church = await Church.findById(req.params.id);
        if (!church) {
          res.sendStatus(404);
        } else {
          res.json(church);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // delete a church by id
  .delete(async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const resource = await Church.findByIdAndDelete(req.params.id);
        console.log(res);
        if (resource) {
          res.sendStatus(204);
        } else {
          // already deleted
          res.sendStatus(404);
        }
      } else {
        // resource doesn't exist
        res.sendStatus(404);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // update a church by id
  .patch(async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const updatedChurch = await Church.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChurch);
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });      
    }
  });

module.exports = router;
