/* eslint-disable no-prototype-builtins */
import { RelationType } from '../models/relation';
import { getMemberById } from '../services/memberService';

const isRelationTypeValid = async (
  relationType: RelationType,
  ownerId: string,
  personId: string,
): Promise<boolean> => {
  if (ownerId === personId) {
    return false;
  }

  const owner = await getMemberById(ownerId);
  const person = await getMemberById(personId);

  if (!owner || !person) {
    return false;
  }

  if (
    relationType === 'child' || relationType === 'parent'
    || ((owner.sex === null || !owner.hasOwnProperty('sex')) && (person.sex === null || !person.hasOwnProperty('sex')))
    || (relationType === 'wife' && owner.sex === true && person.sex === false)
    || (relationType === 'wife' && owner.sex === null && person.sex === false)
    || (relationType === 'wife' && owner.sex === true && person.sex === null)
    || (relationType === 'husband' && owner.sex === false && person.sex === true)
    || (relationType === 'husband' && owner.sex === null && person.sex === true)
    || (relationType === 'husband' && owner.sex === false && person.sex === null)
  ) {
    return true;
  }
  return false;
};

export default isRelationTypeValid;
