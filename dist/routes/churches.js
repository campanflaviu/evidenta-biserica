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
const church_1 = __importDefault(require("../models/church"));
const checkValidId_1 = __importDefault(require("../utils/checkValidId"));
const router = express_1.default.Router();
router
    .route('/')
    // get all churches
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const churches = yield church_1.default.find();
        res.json(churches);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // add a new church
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req.body.name) === null || _a === void 0 ? void 0 : _a.length) && ((_b = req.body.address) === null || _b === void 0 ? void 0 : _b.length)) {
        const church = new church_1.default({
            name: req.body.name,
            address: req.body.address,
        });
        try {
            yield church.save();
            res.sendStatus(204);
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(500).json({ error: e.message });
            }
        }
    }
    else {
        res.sendStatus(400); // bad request
    }
}));
router
    .route('/:id')
    // get a church by id
    .get(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const church = yield church_1.default.findById(req.params.id);
        if (!church) {
            res.sendStatus(404);
        }
        else {
            res.json(church);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // delete a church by id
    .delete(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield church_1.default.findByIdAndDelete(req.params.id);
        if (resource) {
            res.sendStatus(204);
        }
        else {
            // already deleted
            res.sendStatus(404);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // update a church by id
    .patch(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedChurch = yield church_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChurch);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}));
exports.default = router;
