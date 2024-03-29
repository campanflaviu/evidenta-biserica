/* eslint-disable no-console */
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import chalk from 'chalk';
import cors from 'cors';
// import unless from 'express-unless';
import compression from 'compression';

import docs from './docs';
import churchesRouter from './routes/churches';
import membersRouter from './routes/members';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import relationsRouter from './routes/relations';
import transfersRouter from './routes/transfers';
import specialCasesRouter from './routes/specialCases';

// setup env config
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

// setup express
const app = express();

const shouldCompress = () => true;

// setup compression
// TODO test if this makes a difference
app.use(compression({
  filter: shouldCompress,
}));

app.use(express.json());

// cors setup
// TODO make sure this works on prod domain also
const corsOptions = {
  // origin: [`http://localhost:${process.env.PORT || 5000}`],
  credentials: true,
};
app.use(cors(corsOptions));

// requests coloring
const morganMiddleware = morgan((tokens, req, res) => [
  // '\n\n\n',
  chalk.hex('#34ace0').bold(tokens.method(req, res)),
  chalk.hex('#ffb142').bold(tokens.status(req, res)),
  chalk.hex('#ff5252').bold(tokens.url(req, res)),
  chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
  chalk.hex('#f78fb3').bold(`@ ${tokens.date(req, res)}`),
  chalk.yellow(tokens['remote-addr'](req, res)),
  chalk.hex('#fffa65').bold(`from ${tokens.referrer(req, res)}`),
  chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
  // '\n\n\n',
].join(' '));
app.use(morganMiddleware);

// middlewarefor auth token requests - disabled until frontend sets up authorization
// auth.authenticateToken.unless = unless;
// app.use(auth.authenticateToken.unless({
//   path: [
//     { url: '/auth/login', methods: ['POST'] },
//     { url: '/auth/register', methods: ['POST'] },
//   ],
// }));

// mongo db connection
mongoose.connect(process.env.DATABASE_URL || '');
const db = mongoose.connection;
db.on('error', (err: any) => console.error(err));
db.on('open', () => {
  console.log('connected to mongo');
  console.log('ready...');
});

// routing
app.use('/churches', churchesRouter);
app.use('/members', membersRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/relations', relationsRouter);
app.use('/transfers', transfersRouter);
app.use('/special-cases', specialCasesRouter);

// generic error handling - should be enabled in production
// app.use(async (err, req, res, next) => {
//   await res.status(500).json({ error: err, req: req.data });
// });

// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// start app on port
const port = process.env.PORT || 5000;
console.log(`started app on port ${port}`);
app.listen(port);
