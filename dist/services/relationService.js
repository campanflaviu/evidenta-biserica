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
exports.updateMemberRelations = exports.updateRelationById = exports.deleteRelationById = exports.addNewRelation = void 0;
const member_1 = __importDefault(require("../models/member"));
const relation_1 = __importDefault(require("../models/relation"));
const getRelationTypeComplement_1 = __importDefault(require("../utils/getRelationTypeComplement"));
const isRelationTypeValid_1 = __importDefault(require("../utils/isRelationTypeValid"));
const addNewRelation = (relation) => __awaiter(void 0, void 0, void 0, function* () {
    const relationToSave = new relation_1.default(relation);
    yield relationToSave.save();
    // add relation to owner
    const owner = yield member_1.default.findById(relation.owner);
    owner.relations.push({
        relation: relationToSave._id,
        isOwner: true,
    });
    yield owner.save();
    // add relation to other person
    const otherPerson = yield member_1.default.findById(relation.person);
    otherPerson.relations.push({
        relation: relationToSave._id,
        isOwner: false,
    });
    yield otherPerson.save();
    return true;
});
exports.addNewRelation = addNewRelation;
const deleteRelationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const relation = yield relation_1.default.findById(id);
    // const resource = await Relation.findByIdAndDelete(id);
    if (relation) {
        // remove relation from owner
        const owner = yield member_1.default.findById({ _id: relation.owner });
        if (owner) {
            // console.log('check del', owner, relation);
            owner.relations = owner.relations.filter((ownerRelation) => String(ownerRelation.relation) !== String(relation._id));
            yield owner.save();
        }
        // remove relation from the other person
        const other = yield member_1.default.findById({ _id: relation.person });
        // console.log('check del2', other, relation);
        if (other) {
            other.relations = owner.relations.filter((personRelation) => personRelation.relation !== relation._id);
            yield other.save();
        }
        // delete the relation itself
        yield relation_1.default.findByIdAndDelete(id);
        return true;
    }
    return false;
});
exports.deleteRelationById = deleteRelationById;
const updateRelationById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const relation = yield relation_1.default.findById(id);
    // we should remove the relation from the old owner and set the new one
    if (data.owner !== relation.owner) {
        // remove old owner
        const oldOwner = yield member_1.default.findById({ _id: relation.owner });
        oldOwner.relations = oldOwner.relations.filter((ownerRelation) => String(ownerRelation.relation) !== String(relation._id));
        yield oldOwner.save();
        // add new owner
        const newOwner = yield member_1.default.findById(data.owner);
        newOwner.relations.push({
            relation,
            isOwner: true,
        });
        yield newOwner.save();
    }
    if (data.person !== relation.person) {
        // remove person and add
    }
    const updatedRelation = yield relation_1.default.findByIdAndUpdate(id, data, {
        new: true,
    });
    return updatedRelation;
});
exports.updateRelationById = updateRelationById;
const getRelationsByOwnerId = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const relations = yield relation_1.default.find({ owner: ownerId });
    return relations;
});
const removeRelationsNotReceived = (ownerId, receivedRelations) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRelations = yield getRelationsByOwnerId(ownerId);
    const relationsToBeRemoved = existingRelations.filter((relation) => !receivedRelations.some((receivedRelation) => relation.person.toString() === receivedRelation.person));
    yield relationsToBeRemoved.reduce((promise, relation) => __awaiter(void 0, void 0, void 0, function* () {
        yield promise;
        // console.log('should delete relation with id', relation._id);
        yield (0, exports.deleteRelationById)(relation._id);
    }), Promise.resolve());
    // console.log('relationsToBeRemoved', relationsToBeRemoved, existingRelations);
});
const updateMemberRelations = (ownerId, relations) => __awaiter(void 0, void 0, void 0, function* () {
    const updateStatuses = [];
    if (!relations) {
        return updateStatuses;
    }
    // https://www.tutorialsbyte.com/how-to-use-async-await-with-a-foreach-loop-in-nodejs/
    yield relations.reduce((promise, relation) => __awaiter(void 0, void 0, void 0, function* () {
        yield promise;
        // check if the person has a relation already
        const relationTypeValid = yield (0, isRelationTypeValid_1.default)(relation.type, ownerId, relation.person);
        let existingRelationsSpousePerson = [];
        let existingRelationsSpouseOwner = [];
        if (relation.type !== 'child' && relation.type !== 'parent') {
            existingRelationsSpousePerson = yield relation_1.default.find({
                person: relation.person, type: relation.type,
            });
            existingRelationsSpouseOwner = yield relation_1.default.find({
                owner: relation.person,
                type: (0, getRelationTypeComplement_1.default)(relation.type),
            });
        }
        if (!relationTypeValid) {
            updateStatuses.push({
                status: 'error',
                relation: Object.assign({ owner: ownerId }, relation),
                error: 'Invalid relation type',
            });
        }
        else if (existingRelationsSpousePerson.length
            && existingRelationsSpousePerson[0].owner.equals(ownerId)
            && existingRelationsSpousePerson[0].type === relation.type) {
            // existing relation, we should update it
            const updatedRelation = yield (0, exports.updateRelationById)(existingRelationsSpousePerson[0]._id, Object.assign({ owner: ownerId }, relation));
            updateStatuses.push({
                status: 'success',
                relation: updatedRelation,
            });
        }
        else if (existingRelationsSpousePerson.length) {
            updateStatuses.push({
                status: 'error',
                relation: existingRelationsSpousePerson[0],
                error: 'Person already has relation - person',
            });
        }
        else if (existingRelationsSpouseOwner.length) {
            updateStatuses.push({
                status: 'error',
                relation: existingRelationsSpouseOwner[0],
                error: 'Person already has relation - owner',
            });
        }
        else {
            // new relation, we should save it
            const relationToSave = new relation_1.default(Object.assign({ owner: ownerId }, relation));
            yield relationToSave.save();
            // add owner and person
            // add relation to owner
            const owner = yield member_1.default.findById(relationToSave.owner);
            owner.relations.push({
                relation: relationToSave._id,
                isOwner: true,
            });
            yield owner.save();
            // add relation to other person
            const otherPerson = yield member_1.default.findById(relationToSave.person);
            otherPerson.relations.push({
                relation: relationToSave._id,
                isOwner: false,
            });
            yield otherPerson.save();
            updateStatuses.push({
                status: 'success',
                relation: relationToSave,
            });
        }
    }), Promise.resolve());
    // TODO remove relations that were not received
    removeRelationsNotReceived(ownerId, relations);
    return updateStatuses;
});
exports.updateMemberRelations = updateMemberRelations;
