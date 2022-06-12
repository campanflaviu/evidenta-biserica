import UserModel from '../models/user';

export const getById = async (id: string) => {
  const user = await UserModel.findById(id);
  // console.log('user', user);
  return user?.toJSON();
};

export const deleteById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user.remove();
};

// this should be disabled in production, or stripped
export const getAll = async () => UserModel.find();
