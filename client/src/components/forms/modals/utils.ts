import { RelationshipType } from '../../../types';

export const removeWhiteSpace = (str: string) => {
  return str.replace(/\s/g, '');
};

export const getSourceLabel = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return 'Parent';
    case 'Realization':
      return 'Interface';
    case 'Dependency':
      return 'Client';
    default:
      return 'Source';
  }
};

export const getTargetLabel = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return 'Child';
    case 'Realization':
      return 'Class';
    case 'Dependency':
      return 'Supplier';
    default:
      return 'Target';
  }
};

export const getSourcePermittedEntities = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return ['class'];
    case 'Realization':
      return ['interface'];
    case 'Dependency':
      return ['class', 'interface'];
    default:
      return [];
  }
};

export const getTargetPermittedEntities = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return ['class'];
    case 'Realization':
      return ['class', 'interface'];
    case 'Dependency':
      return ['class', 'interface'];
    default:
      return [];
  }
};
