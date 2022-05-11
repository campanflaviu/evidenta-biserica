import User from '../models/user';

const getById = async (id: string) => {
  const user = await User.findById(id);
  return user.toJSON();
};

const deleteById = async (id: string) => {
  const user = await User.findById(id);
  return user.remove();
};

// this should be disabled in production, or stripped
const getAll = async () => User.find();

export {
  getById,
  deleteById,
  getAll,
};
