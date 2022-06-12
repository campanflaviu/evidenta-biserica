import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  return jwt.verify(token, (process.env.JWT_TOKEN_SECRET as string), (err, user) => {
    if (err) {
      console.log('jwt verify error', err);
      return res.sendStatus(403);
    }
    req.body.user = user;
    return next();
  });
};

export const generateAccessToken = (username: string) => jwt.sign(
  { data: username },
  (process.env.JWT_TOKEN_SECRET as string),
  { expiresIn: '1h' },
);
