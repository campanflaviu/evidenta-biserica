import { RelationType } from '../models/relation';

const getRelationTypeComplement = (relationType: RelationType): RelationType => {
  if (relationType === 'wife') return 'husband';
  if (relationType === 'husband') return 'wife';
  if (relationType === 'child') return 'parent';
  return 'child';
};

export default getRelationTypeComplement;
