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
Object.defineProperty(exports, "__esModule", { value: true });
const memberService_1 = require("../services/memberService");
const isRelationTypeValid = (relationType, ownerId, personId) => __awaiter(void 0, void 0, void 0, function* () {
    if (ownerId === personId) {
        return false;
    }
    const owner = yield (0, memberService_1.getMemberById)(ownerId);
    const person = yield (0, memberService_1.getMemberById)(personId);
    if (!owner || !person) {
        return false;
    }
    if (relationType === 'child' || relationType === 'parent'
        || ((owner.sex === null || !owner.hasOwnProperty('sex')) && (person.sex === null || !person.hasOwnProperty('sex')))
        || (relationType === 'wife' && owner.sex === true && person.sex === false)
        || (relationType === 'wife' && owner.sex === null && person.sex === false)
        || (relationType === 'wife' && owner.sex === true && person.sex === null)
        || (relationType === 'husband' && owner.sex === false && person.sex === true)
        || (relationType === 'husband' && owner.sex === null && person.sex === true)
        || (relationType === 'husband' && owner.sex === false && person.sex === null)) {
        return true;
    }
    return false;
});
exports.default = isRelationTypeValid;
