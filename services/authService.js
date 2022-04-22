const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../services/jwt');

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  
  if (bcrypt.compareSync(password, user.password)) {
    const token = auth.generateAccessToken(email);
    console.log('login user', token);

    return { ...user.toJSON(), token };
  } else {
    console.log('doesnt match');
  }
};

const register = async (params) => {
  const user = new User(params);
  return user.save();
};

module.exports = {
  login,
  register,
};
