const express = require('express');
const router = express.Router();
const Church = require('../models/church');

const logger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};


router.use(logger);

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

    console.log(req.body.name);

    try {
      const newChurch = await church.save();
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      console.error(e);
      res.json({ error: 'error' });
    }
  })

module.exports = router;
