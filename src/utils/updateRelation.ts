import { MemberRelation } from '../models/member';

const updateRelation = (rel: MemberRelation) => {
  const current = rel;
  // no change, exit
  if (current.isOwner) {
    return current;
  }

  // should update the relation type
  if (current.relation.type === 'wife') {
    current.relation.type = 'husband';
  } else if (current.relation.type === 'husband') {
    current.relation.type = 'wife';
  } else if (current.relation.type === 'parent') {
    current.relation.type = 'child';
  } else if (current.relation.type === 'child') {
    current.relation.type = 'parent';
  }

  // should update the person
  // the owner is removed in 'toJson' hook in member.js
  current.relation.person = current.relation.owner;
  return current;
};

export default updateRelation;
