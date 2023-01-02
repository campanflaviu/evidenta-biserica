"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
const cors_1 = __importDefault(require("cors"));
// import unless from 'express-unless';
const compression_1 = __importDefault(require("compression"));
const docs_1 = __importDefault(require("./docs"));
const churches_1 = __importDefault(require("./routes/churches"));
const members_1 = __importDefault(require("./routes/members"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const relations_1 = __importDefault(require("./routes/relations"));
const transfers_1 = __importDefault(require("./routes/transfers"));
const specialCases_1 = __importDefault(require("./routes/specialCases"));
// setup env config
if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}
// setup express
const app = (0, express_1.default)();
const shouldCompress = () => true;
// setup compression
// TODO test if this makes a difference
app.use((0, compression_1.default)({
    filter: shouldCompress,
}));
app.use(express_1.default.json());
// cors setup
// TODO make sure this works on prod domain also
const corsOptions = {
    // origin: [`http://localhost:${process.env.PORT || 5000}`],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// requests coloring
const morganMiddleware = (0, morgan_1.default)((tokens, req, res) => [
    // '\n\n\n',
    chalk_1.default.hex('#34ace0').bold(tokens.method(req, res)),
    chalk_1.default.hex('#ffb142').bold(tokens.status(req, res)),
    chalk_1.default.hex('#ff5252').bold(tokens.url(req, res)),
    chalk_1.default.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
    chalk_1.default.hex('#f78fb3').bold(`@ ${tokens.date(req, res)}`),
    chalk_1.default.yellow(tokens['remote-addr'](req, res)),
    chalk_1.default.hex('#fffa65').bold(`from ${tokens.referrer(req, res)}`),
    chalk_1.default.hex('#1e90ff')(tokens['user-agent'](req, res)),
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
mongoose_1.default.connect(process.env.DATABASE_URL || '');
const db = mongoose_1.default.connection;
db.on('error', (err) => console.error(err));
db.on('open', () => {
    console.log('connected to mongo');
    console.log('ready...');
});
// routing
app.use('/churches', churches_1.default);
app.use('/members', members_1.default);
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
app.use('/relations', relations_1.default);
app.use('/transfers', transfers_1.default);
app.use('/special-cases', specialCases_1.default);
// generic error handling - should be enabled in production
// app.use(async (err, req, res, next) => {
//   await res.status(500).json({ error: err, req: req.data });
// });
// Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(docs_1.default));
// start app on port
const port = process.env.PORT || 5000;
console.log(`started app on port ${port}`);
app.listen(port);
