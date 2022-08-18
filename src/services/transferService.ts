import MemberModel from '../models/member';
import TransferModel, { Transfer } from '../models/transfers';

// interface TransferUpdateStatus {
//   status: 'error' | 'success';
//   relation: Transfer;
//   error?: string;
// }

export const addNewTransfer = async (transfer: Transfer) => {
  const transferToSave = new TransferModel(transfer);
  await transferToSave.save();

  // add transfer to owner
  const owner = await MemberModel.findById(transfer.owner);
  owner.transfers.push(transferToSave._id);
  await owner.save();

  return true;
};

export const deleteTransferById = async (id: string) => {
  const transfer = await TransferModel.findById(id);
  // const resource = await Relation.findByIdAndDelete(id);
  if (transfer) {
    // remove relation from owner
    const owner = await MemberModel.findById({ _id: transfer.owner });
    if (owner) {
      // console.log('check del', owner, relation);
      owner.transfers = owner.transfers.filter(
        (ownerTransfer: any) => String(ownerTransfer) !== String(transfer._id),
      );
      await owner.save();
    }

    // delete the relation itself
    await TransferModel.findByIdAndDelete(id);
    return true;
  }
  return false;
};

// export const updateTransferById = async (id: string, data: Transfer) => {
// const relation = await TransferModel.findById(id);
// // we should remove the relation from the old owner and set the new one
// if (data.owner !== relation.owner) {
//   // remove old owner
//   const oldOwner = await MemberModel.findById({ _id: relation.owner });
//   oldOwner.relations = oldOwner.relations.filter(
//     (ownerRelation: any) => String(ownerRelation.relation) !== String(relation._id),
//   );
//   await oldOwner.save();

//   // add new owner
//   const newOwner = await MemberModel.findById(data.owner);
//   newOwner.relations.push({
//     relation,
//     isOwner: true,
//   });
//   await newOwner.save();
// }
// if (data.person !== relation.person) {
//   // remove person and add
// }
// const updatedRelation = await RelationModel.findByIdAndUpdate(id, data, {
//   new: true,
// });
// return updatedRelation;
// };

// const getRelationsByOwnerId = async (ownerId: string) => {
//   const relations = await RelationModel.find({ owner: ownerId });
//   return relations;
// };

// const removeRelationsNotReceived = async (ownerId: string, receivedRelations: UserRelation[]) => {
//   const existingRelations = await getRelationsByOwnerId(ownerId);

//   const relationsToBeRemoved = existingRelations.filter(
//     (relation: Relation) => !receivedRelations.some(
//       (receivedRelation) => relation.person.toString() === receivedRelation.person,
//     ),
//   );
//   await relationsToBeRemoved.reduce(async (promise, relation) => {
//     await promise;
//     // console.log('should delete relation with id', relation._id);
//     await deleteRelationById(relation._id);
//   }, Promise.resolve());
//   // console.log('relationsToBeRemoved', relationsToBeRemoved, existingRelations);
// };

// export const updateMemberRelations = async (
//   ownerId: string,
//   relations: UserRelation[],
// ): Promise<RelationUpdateStatus[]> => {
//   const updateStatuses: RelationUpdateStatus[] = [];

//   if (!relations) {
//     return updateStatuses;
//   }

//   // https://www.tutorialsbyte.com/how-to-use-async-await-with-a-foreach-loop-in-nodejs/
//   await relations.reduce(async (promise, relation) => {
//     await promise;

//     // check if the person has a relation already
//     const relationTypeValid = await isRelationTypeValid(relation.type, ownerId, relation.person);

//     const existingRelationsPerson = await RelationModel.find({
//       person: relation.person, type: relation.type,
//     });
//     const existingRelationsOwner = await RelationModel.find({
//       owner: relation.person,
//       type: getRelationTypeComplement(relation.type),
//     });

//     if (!relationTypeValid) {
//       updateStatuses.push({
//         status: 'error',
//         relation: { owner: ownerId, ...relation },
//         error: 'Invalid relation type',
//       });
//     } else if (
//       existingRelationsPerson.length
//       && existingRelationsPerson[0].owner.equals(ownerId)
//       && existingRelationsPerson[0].type === relation.type
//     ) {
//       // existing relation, we should update it
//       const updatedRelation = await updateRelationById(
//         existingRelationsPerson[0]._id,
//         { owner: ownerId, ...relation },
//       );
//       updateStatuses.push({
//         status: 'success',
//         relation: updatedRelation,
//       });
//     } else if (existingRelationsPerson.length) {
//       updateStatuses.push({
//         status: 'error',
//         relation: existingRelationsPerson[0],
//         error: 'Person already has relation',
//       });
//     } else if (existingRelationsOwner.length) {
//       updateStatuses.push({
//         status: 'error',
//         relation: existingRelationsOwner[0],
//         error: 'Person already has relation',
//       });
//     } else {
//       // new relation, we should save it
//       const relationToSave = new RelationModel({ owner: ownerId, ...relation });
//       await relationToSave.save();

//       // add owner and person

//       // add relation to owner
//       const owner = await MemberModel.findById(relationToSave.owner);
//       owner.relations.push({
//         relation: relationToSave._id,
//         isOwner: true,
//       });
//       await owner.save();

//       // add relation to other person
//       const otherPerson = await MemberModel.findById(relationToSave.person);
//       otherPerson.relations.push({
//         relation: relationToSave._id,
//         isOwner: false,
//       });
//       await otherPerson.save();

//       updateStatuses.push({
//         status: 'success',
//         relation: relationToSave,
//       });
//     }
//   }, Promise.resolve());

//   // TODO remove relations that were not received
//   removeRelationsNotReceived(ownerId, relations);
//   return updateStatuses;
// };
