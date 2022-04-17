// setup env config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');

const churchesRouter = require('./routes/churches');
const membersRouter = require('./routes/members');

// setup express
const app = express();
app.use(express.json());

// requests coloring
const morganMiddleware = morgan((tokens, req, res) => {
  return [
      // '\n\n\n',
      chalk.hex('#34ace0').bold(tokens.method(req, res)),
      chalk.hex('#ffb142').bold(tokens.status(req, res)),
      chalk.hex('#ff5252').bold(tokens.url(req, res)),
      chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
      chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
      chalk.yellow(tokens['remote-addr'](req, res)),
      chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
      chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
      // '\n\n\n',
  ].join(' ');
});
app.use(morganMiddleware);

// mongo db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.on('open', () => console.log('connected to mongo'));


// routing
app.use('/churches', churchesRouter);
app.use('/members', membersRouter);


// start app on port
const port = process.env.PORT || 5000
console.log(`started app on port ${port}`);
app.listen(port);
