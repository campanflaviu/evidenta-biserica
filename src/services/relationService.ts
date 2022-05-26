import MemberModel from '../models/member';
import RelationModel, { Relation } from '../models/relation';

const addNewRelation = async (relation: Relation) => {
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

const deleteRelationById = async (id: string) => {
  const relation = await RelationModel.findById(id);
  // const resource = await Relation.findByIdAndDelete(id);
  if (relation) {
    // remove relation from owner
    const owner = await MemberModel.findById({ _id: relation.owner });
    owner.relations = owner.relations.filter(
      (ownerRelation: any) => String(ownerRelation.relation) !== String(relation._id),
    );
    await owner.save();

    // remove relation from the other person
    const other = await MemberModel.findById({ _id: relation.person });
    other.relations = owner.relations.filter(
      (personRelation: any) => personRelation.relation !== relation._id,
    );
    await other.save();

    // delete the relation itself
    await RelationModel.findByIdAndDelete(id);
    return true;
  }
  return false;
};

const updateRelationById = async (id: string, data: Relation) => {
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

export {
  addNewRelation,
  deleteRelationById,
  updateRelationById,
};
