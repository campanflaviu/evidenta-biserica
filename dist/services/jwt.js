"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.authenticateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    return jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('jwt verify error', err);
            return res.sendStatus(403);
        }
        req.body.user = user;
        return next();
    });
};
exports.authenticateToken = authenticateToken;
const generateAccessToken = (username) => jsonwebtoken_1.default.sign({ data: username }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
exports.generateAccessToken = generateAccessToken;
