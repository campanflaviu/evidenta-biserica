import MemberModel from '../models/member';
import RelationModel, { Relation } from '../models/relation';
import { UserRelation } from '../models/user';
import getRelationTypeComplement from '../utils/getRelationTypeComplement';
import isRelationTypeValid from '../utils/isRelationTypeValid';

interface RelationUpdateStatus {
  status: 'error' | 'success';
  relation: Relation;
  error?: string;
}

export const addNewRelation = async (relation: Relation) => {
  const relationToSave = new RelationModel(relation);
  await relationToSave.save();

  // add relation to owner
  const owner = await MemberModel.findById(relation.owner);
  owner.relations.push({
    relation: relationToSave._id,
    isOwner: true,
  });
  await owner.save();

  // add relation to other person
  const otherPerson = await MemberModel.findById(relation.person);
  otherPerson.relations.push({
    relation: relationToSave._id,
    isOwner: false,
  });
  await otherPerson.save();
  return true;
};

export const deleteRelationById = async (id: string) => {
  const relation = await RelationModel.findById(id);
  // const resource = await Relation.findByIdAndDelete(id);
  if (relation) {
    // remove relation from owner
    const owner = await MemberModel.findById({ _id: relation.owner });
    if (owner) {
      // console.log('check del', owner, relation);
      owner.relations = owner.relations.filter(
        (ownerRelation: any) => String(ownerRelation.relation) !== String(relation._id),
      );
      await owner.save();
    }

    // remove relation from the other person
    const other = await MemberModel.findById({ _id: relation.person });
    // console.log('check del2', other, relation);

    if (other) {
      other.relations = owner.relations.filter(
        (personRelation: any) => personRelation.relation !== relation._id,
      );
      await other.save();
    }

    // delete the relation itself
    await RelationModel.findByIdAndDelete(id);
    return true;
  }
  return false;
};

export const updateRelationById = async (id: string, data: Relation) => {
  const relation = await RelationModel.findById(id);
  // we should remove the relation from the old owner and set the new one
  if (data.owner !== relation.owner) {
    // remove old owner
    const oldOwner = await MemberModel.findById({ _id: relation.owner });
    oldOwner.relations = oldOwner.relations.filter(
      (ownerRelation: any) => String(ownerRelation.relation) !== String(relation._id),
    );
    await oldOwner.save();

    // add new owner
    const newOwner = await MemberModel.findById(data.owner);
    newOwner.relations.push({
      relation,
      isOwner: true,
    });
    await newOwner.save();
  }
  if (data.person !== relation.person) {
    // remove person and add
  }
  const updatedRelation = await RelationModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedRelation;
};

const getRelationsByOwnerId = async (ownerId: string) => {
  const relations = await RelationModel.find({ owner: ownerId });
  return relations;
};

const removeRelationsNotReceived = async (ownerId: string, receivedRelations: UserRelation[]) => {
  const existingRelations = await getRelationsByOwnerId(ownerId);

  const relationsToBeRemoved = existingRelations.filter(
    (relation: Relation) => !receivedRelations.some(
      (receivedRelation) => relation.person.toString() === receivedRelation.person,
    ),
  );
  await relationsToBeRemoved.reduce(async (promise, relation) => {
    await promise;
    // console.log('should delete relation with id', relation._id);
    await deleteRelationById(relation._id);
  }, Promise.resolve());
  // console.log('relationsToBeRemoved', relationsToBeRemoved, existingRelations);
};

export const updateMemberRelations = async (
  ownerId: string,
  relations: UserRelation[],
): Promise<RelationUpdateStatus[]> => {
  const updateStatuses: RelationUpdateStatus[] = [];

  if (!relations) {
    return updateStatuses;
  }

  // https://www.tutorialsbyte.com/how-to-use-async-await-with-a-foreach-loop-in-nodejs/
  await relations.reduce(async (promise, relation) => {
    await promise;

    // check if the person has a relation already
    const relationTypeValid = await isRelationTypeValid(relation.type, ownerId, relation.person);
    let existingRelationsSpousePerson = [];
    let existingRelationsSpouseOwner = [];

    if (relation.type !== 'child' && relation.type !== 'parent') {
      existingRelationsSpousePerson = await RelationModel.find({
        person: relation.person, type: relation.type,
      });
      existingRelationsSpouseOwner = await RelationModel.find({
        owner: relation.person,
        type: getRelationTypeComplement(relation.type),
      });
    }

    if (!relationTypeValid) {
      updateStatuses.push({
        status: 'error',
        relation: { owner: ownerId, ...relation },
        error: 'Invalid relation type',
      });
    } else if (
      existingRelationsSpousePerson.length
      && existingRelationsSpousePerson[0].owner.equals(ownerId)
      && existingRelationsSpousePerson[0].type === relation.type
    ) {
      // existing relation, we should update it
      const updatedRelation = await updateRelationById(
        existingRelationsSpousePerson[0]._id,
        { owner: ownerId, ...relation },
      );
      updateStatuses.push({
        status: 'success',
        relation: updatedRelation,
      });
    } else if (existingRelationsSpousePerson.length) {
      updateStatuses.push({
        status: 'error',
        relation: existingRelationsSpousePerson[0],
        error: 'Person already has relation - person',
      });
    } else if (existingRelationsSpouseOwner.length) {
      updateStatuses.push({
        status: 'error',
        relation: existingRelationsSpouseOwner[0],
        error: 'Person already has relation - owner',
      });
    } else {
      // new relation, we should save it
      const relationToSave = new RelationModel({ owner: ownerId, ...relation });
      await relationToSave.save();

      // add owner and person

      // add relation to owner
      const owner = await MemberModel.findById(relationToSave.owner);
      owner.relations.push({
        relation: relationToSave._id,
        isOwner: true,
      });
      await owner.save();

      // add relation to other person
      const otherPerson = await MemberModel.findById(relationToSave.person);
      otherPerson.relations.push({
        relation: relationToSave._id,
        isOwner: false,
      });
      await otherPerson.save();

      updateStatuses.push({
        status: 'success',
        relation: relationToSave,
      });
    }
  }, Promise.resolve());

  // TODO remove relations that were not received
  removeRelationsNotReceived(ownerId, relations);
  return updateStatuses;
};
