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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaService_1 = require("../services/mediaService");
const memberService_1 = require("../services/memberService");
const relationService_1 = require("../services/relationService");
const member_1 = __importDefault(require("../models/member"));
const checkValidId_1 = __importDefault(require("../utils/checkValidId"));
const updateRelation_1 = __importDefault(require("../utils/updateRelation"));
const router = express_1.default.Router();
router
    .route('/')
    // get all members
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield member_1.default.find().populate({
            path: 'relations',
            populate: {
                path: 'relation',
                model: 'Relation',
                populate: {
                    path: 'person',
                },
            },
        }).populate('transfers');
        // if (typeof member.relations[0] !== 'string') {
        // };
        res.json(members);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // add a new memmber
    .post(mediaService_1.uploadMedia.single('profileImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield (0, memberService_1.addNewMember)(req.body, req.file);
        if (member) {
            res.status(200).json(Object.assign({}, member === null || member === void 0 ? void 0 : member._doc));
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}));
router
    .route('/:id')
    // get a member by id
    .get(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let member = yield member_1.default.findById(req.params.id);
        // console.log('member', typeof member.relations[0]);
        if (typeof member.relations[0] !== 'string') {
            member = yield member.populate([{
                    path: 'relations',
                    populate: {
                        path: 'relation',
                        model: 'Relation',
                        // select: '-owner' // exclude owner field (since we might have switched it)
                        // - not used since we use the owner for calculations
                        // I don't think this is needed since we already have the list on FE
                        populate: {
                            path: 'person',
                            // ['_id', 'name']
                            // select: 'firstName',
                            // select: {
                            //   _id: 1,
                            // firstName: 1,
                            // lastName: 1,
                            // },
                            // model: 'Member',
                        },
                    },
                }, {
                    path: 'transfers',
                    model: 'Transfer',
                }]);
        }
        if (!member) {
            res.sendStatus(404);
        }
        else {
            // update relationship type
            member.relations = member.relations.map(updateRelation_1.default);
            res.json(member);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
    }
}))
    // delete a member by id
    .delete(checkValidId_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield member_1.default.findById(req.params.id);
        // remove cloudinary reference if present
        if (member.imageId) {
            yield (0, mediaService_1.removeMedia)(member.imageId);
        }
        yield member.remove();
        res.sendStatus(204);
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ error: e.message });
        }
    }
}))
    // update a memmber by id
    .patch(checkValidId_1.default, mediaService_1.uploadMedia.single('profileImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // if an image is sent, then the body should be in the doc obj
        const memberData = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.doc) ? JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.doc) : req.body;
        const { relations } = memberData, memberWithoutRelations = __rest(memberData, ["relations"]);
        // console.log('relations', relations);
        // console.log('member', memberWithoutRelations);
        const updateStatuses = yield (0, relationService_1.updateMemberRelations)(req.params.id, relations);
        // console.log('update statuses', updateStatuses);
        const updatedMember = yield (0, memberService_1.updateMemberById)(req.params.id, memberWithoutRelations, req.file);
        res.json(Object.assign(Object.assign({}, updatedMember), { relationStatuses: updateStatuses }));
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ error: e.message });
        }
    }
}));
exports.default = router;
