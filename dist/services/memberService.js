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
exports.getMemberById = exports.updateMemberById = exports.addNewMember = void 0;
const member_1 = __importDefault(require("../models/member"));
const mediaService_1 = require("./mediaService");
const addNewMember = (memberDetails, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = memberDetails.firstName) === null || _a === void 0 ? void 0 : _a.length) && ((_b = memberDetails.lastName) === null || _b === void 0 ? void 0 : _b.length)) {
        const member = new member_1.default(Object.assign(Object.assign({}, memberDetails), { imagePath: (image === null || image === void 0 ? void 0 : image.imagePath) || null, imageId: (image === null || image === void 0 ? void 0 : image.imageId) || null }));
        const newMember = yield member.save();
        return newMember;
    }
    return false;
});
exports.addNewMember = addNewMember;
const updateMemberById = (id, memberDetails, image) => __awaiter(void 0, void 0, void 0, function* () {
    // we should check if there is an image uploaded, so we should delete it after we replace it
    const member = yield member_1.default.findById(id);
    // if an image is sent, then the body should be in the doc obj
    // const file = req.file as CloudinaryFile;
    let updatedMemberData = memberDetails;
    if ((image === null || image === void 0 ? void 0 : image.imagePath) && (image === null || image === void 0 ? void 0 : image.imageId)) {
        yield (0, mediaService_1.removeMedia)(member.imageId);
        updatedMemberData = Object.assign(Object.assign({}, memberDetails), { imagePath: image.imagePath, imageId: image.imageId });
    }
    const updatedMember = yield member_1.default.findByIdAndUpdate(id, updatedMemberData, {
        new: true,
    });
    return updatedMember;
});
exports.updateMemberById = updateMemberById;
const getMemberById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield member_1.default.findById(id);
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
exports.getMemberById = getMemberById;
