const express = require('express');
const router = express.Router();

const logger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};


router.use(logger);

router.get('/', (req, res) => {
  res.send("lista biserici");
});

module.exports = router;
