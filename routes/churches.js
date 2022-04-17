const express = require('express');
const router = express.Router();
const Church = require('../models/church');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const churches = await Church.find();
      res.json(churches);
    } catch {
      res.json({ error: 'error' });
    }
  })
  .post(async (req, res) => {
    const church = new Church({
      name: req.body.name,
      address: req.body.address,
    });

    try {
      const newChurch = await church.save();
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: 'error' });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const church = await Church.findById(req.params.id);
      if (!church) {
        res.status(404).json({ status: 'Church not found'})
      } else {
        res.json(church);
      }
    } catch (e) {
      console.error(e);
      res.status(404).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    try {
      await Church.findByIdAndDelete(req.params.id);
      res.json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const updatedChurch = await Church.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedChurch);
    } catch (e) {
      console.error(e);
      res.json({ error: e.message });      
    }
  });

module.exports = router;
