"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const router = express_1.default.Router();
router
    .route('/')
    .get((req, res, next) => {
    (0, userService_1.getAll)()
        .then((users) => res.json(users))
        .catch((err) => next(err));
});
// TODO get by id
exports.default = router;
