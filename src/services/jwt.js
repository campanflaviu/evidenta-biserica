const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token === null) {
    return res.sendStatus(401);
  }

  return jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('jwt verify error', err);
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  });
};

const generateAccessToken = (username) => jwt.sign(
  { data: username },
  process.env.JWT_TOKEN_SECRET,
  { expiresIn: '1h' },
);

module.exports = {
  authenticateToken,
  generateAccessToken,
};
