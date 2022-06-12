import bcrypt from 'bcryptjs';
import UserModel from '../models/user';
import { generateAccessToken } from './jwt';

interface Credentials {
  email: string,
  password: string,
}

export const login = async ({ email, password }: Credentials) => {
  const user = await UserModel.findOne({ email });

  return new Promise((resolve, reject) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(email);
      resolve({ ...user.toJSON(), token });
    } else {
      // TODO fix this linting error
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(401);
    }
  });
};

export const register = async (params: Credentials) => {
  const user = new UserModel(params);
  return user.save();
};
