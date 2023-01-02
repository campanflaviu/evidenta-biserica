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
const transfers_1 = __importDefault(require("../models/transfers"));
const checkValidId_1 = __importDefault(require("../utils/checkValidId"));
const transferService_1 = require("../services/transferService");
const router = express_1.default.Router();
router
    .route('/')
    // get all transfers (I don't think we need this in prod)
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transfers = yield transfers_1.default.find().populate({
            path: 'owner',
            // TODO send only firstName and lastName
        });
        res.json(transfers);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // add a new transfer
    // TODO - validate relation type
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // TODO validation middleware for required fields
    if (((_a = req.body.owner) === null || _a === void 0 ? void 0 : _a.length) && ((_b = req.body.type) === null || _b === void 0 ? void 0 : _b.length) && ((_c = req.body.date) === null || _c === void 0 ? void 0 : _c.length)) {
        try {
            // save transfer
            yield (0, transferService_1.addNewTransfer)(req.body);
            res.sendStatus(201);
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(500).json({ error: e.message });
            }
        }
    }
    else {
        console.log('aici');
        res.sendStatus(400); // bad request
    }
}));
router
    .route('/:id')
    // get a transfer by id
    .get(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transfer = yield transfers_1.default.findById(req.params.id);
        if (!transfer) {
            res.sendStatus(404);
        }
        else {
            res.json(transfer);
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
        const response = yield (0, transferService_1.deleteTransferById)(req.params.id);
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
}));
// update a relation by id
// .patch(checkValidId, async (req, res) => {
//   try {
//     const updatedRelation = updateRelationById(req.params?.id, req.body);
//     res.json(updatedRelation);
//   } catch (e) {
//     if (e instanceof Error) {
//       res.status(500).json({ error: e.message });
//     }
//   }
// });
exports.default = router;
