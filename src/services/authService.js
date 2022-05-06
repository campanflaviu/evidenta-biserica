const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('./jwt');

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  return new Promise((resolve, reject) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(email);
      resolve({ ...user.toJSON(), token });
    } else {
      // TODO fix this linting error
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(401);
    }
  });
};

const register = async (params) => {
  const user = new User(params);
  return user.save();
};

module.exports = {
  login,
  register,
};
