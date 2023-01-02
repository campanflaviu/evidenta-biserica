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
const express_1 = __importDefault(require("express"));
const checkValidId_1 = __importDefault(require("../utils/checkValidId"));
const specialCase_1 = __importDefault(require("../models/specialCase"));
const specialCaseService_1 = require("../services/specialCaseService");
const router = express_1.default.Router();
router
    .route('/')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const specialCases = yield specialCase_1.default.find();
        res.json(specialCases);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, specialCaseService_1.addNewSpecialCase)(req.body);
        res.sendStatus(201);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}));
router
    .route('/:id')
    .get(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const specialCase = yield specialCase_1.default.findById(req.params.id);
        if (!specialCase) {
            res.sendStatus(404);
        }
        else {
            res.json(specialCase);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    .delete(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield specialCase_1.default.findByIdAndDelete(req.params.id);
        if (response) {
            res.sendStatus(204);
        }
        else {
            // already deleted, or it doesn't exist
            res.sendStatus(404);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    .patch(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSpecialCase = yield specialCase_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSpecialCase);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}));
exports.default = router;
