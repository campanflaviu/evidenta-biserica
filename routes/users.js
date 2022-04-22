const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/user');
const userService = require('../services/userService');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    userService.getAll()
      .then(users => res.json(users))
      .catch(err => next(err));
  });


// TODO get by id

module.exports = router;
