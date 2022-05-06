const updateRelation = (rel) => {
    // no change, exit
    if (rel.isOwner) {
      return rel;
    }
  
    // should update the relation type
    if (rel.relation.type === 'wife') {
      rel.relation.type = 'husband';
    } else if (rel.relation.type === 'husband') {
      rel.relation.type = 'wife';
    } else if (rel.relation.type === 'parent') {
      rel.relation.type = 'child';
    } else if (rel.relation.type === 'child') {
      rel.relation.type = 'parent';
    }
  
    // should update the person
    // the owner is removed in 'toJson' hook in member.js
    rel.relation.person = rel.relation.owner;
    return rel;
}

module.exports = updateRelation;
