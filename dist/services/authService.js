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
exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = require("./jwt");
const login = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email });
    return new Promise((resolve, reject) => {
        if (user && bcryptjs_1.default.compareSync(password, user.password)) {
            const token = (0, jwt_1.generateAccessToken)(email);
            resolve(Object.assign(Object.assign({}, user.toJSON()), { token }));
        }
        else {
            // TODO fix this linting error
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(401);
        }
    });
});
exports.login = login;
const register = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.default(params);
    return user.save();
});
exports.register = register;
