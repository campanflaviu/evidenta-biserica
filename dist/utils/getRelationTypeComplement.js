"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRelationTypeComplement = (relationType) => {
    if (relationType === 'wife')
        return 'husband';
    if (relationType === 'husband')
        return 'wife';
    if (relationType === 'child')
        return 'parent';
    return 'child';
};
exports.default = getRelationTypeComplement;
