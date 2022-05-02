const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/user');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await authService.login({ email, password });
      res.json(user);
    } catch (statusCode) {
      res.sendStatus(typeof statusCode === 'number' ? statusCode : 500);
    }
  });

router
  .route('/register')
  .post((req, res) => {
    const { password } = req.body;
    if (!password && !req.body.email) {
      res.sendStatus(400);
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    authService.register(req.body)
      .then(() => res.send('success'))
      .catch(err => {
        // email already exists
        if (err.code === 11000) {
          res.sendStatus(409);
        } else {
          res.status(500).json({ err: err })
        }
      });
  });

module.exports = router;
