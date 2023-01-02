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
const relation_1 = __importDefault(require("../models/relation"));
const checkValidId_1 = __importDefault(require("../utils/checkValidId"));
const relationService_1 = require("../services/relationService");
const router = express_1.default.Router();
router
    .route('/')
    // get all relations (I don't think we need this in prod)
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const relations = yield relation_1.default.find();
        res.json(relations);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // add a new relation
    // TODO - validate relation type
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // TODO validation middleware for required fields
    if (((_a = req.body.owner) === null || _a === void 0 ? void 0 : _a.length) && ((_b = req.body.person) === null || _b === void 0 ? void 0 : _b.length) && ((_c = req.body.type) === null || _c === void 0 ? void 0 : _c.length)) {
        try {
            // save relation
            yield (0, relationService_1.addNewRelation)(req.body);
            res.sendStatus(201);
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
    // get a relation by id
    .get(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const relation = yield relation_1.default.findById(req.params.id);
        if (!relation) {
            res.sendStatus(404);
        }
        else {
            res.json(relation);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // delete a relation by id
    .delete(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, relationService_1.deleteRelationById)(req.params.id);
        if (response) {
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
    // update a relation by id
    .patch(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const updatedRelation = (0, relationService_1.updateRelationById)((_d = req.params) === null || _d === void 0 ? void 0 : _d.id, req.body);
        res.json(updatedRelation);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}));
exports.default = router;
