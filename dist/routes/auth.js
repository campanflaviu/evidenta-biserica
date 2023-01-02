"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
router
    .route('/login')
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, authService_1.login)({ email, password });
        res.json(user);
    }
    catch (statusCode) {
        res.sendStatus(typeof statusCode === 'number' ? statusCode : 500);
    }
}));
router
    .route('/register')
    .post((req, res) => {
    const { password } = req.body;
    if (!password && !req.body.email) {
        res.sendStatus(400);
        return;
    }
    const salt = bcryptjs_1.default.genSaltSync(10);
    req.body.password = bcryptjs_1.default.hashSync(password, salt);
    (0, authService_1.register)(req.body)
        .then(() => res.send('success'))
        .catch((err) => {
        // email already exists
        if (err.code === 11000) {
            res.sendStatus(409);
        }
        else {
            res.status(500).json({ err });
        }
    });
});
exports.default = router;
