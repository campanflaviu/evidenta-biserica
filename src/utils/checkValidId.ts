import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

const checkValidId = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }
  return res.sendStatus(404);
};

export default checkValidId;
