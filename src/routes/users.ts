import express from 'express';
import { getAll } from '../services/userService';

const router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    getAll()
      .then((users) => res.json(users))
      .catch((err) => next(err));
  });

// TODO get by id

export default router;
