const mongoose = require('mongoose');

const checkValidId = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }
  return res.sendStatus(404);
};

module.exports = checkValidId;
