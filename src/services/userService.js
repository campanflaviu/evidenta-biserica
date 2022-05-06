const User = require('../models/user');

const getById = async (id) => {
  const user = await User.findById(id);
  return user.toJSON();
};

const deleteById = async (id) => {
  const user = await User.findById(id);
  return user.remove();
};

// this should be disabled in production, or stripped
const getAll = async () => User.find();

module.exports = {
  getById,
  deleteById,
  getAll,
};
