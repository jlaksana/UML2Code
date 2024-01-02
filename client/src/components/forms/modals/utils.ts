import { RelationshipType } from '../../../types';

export const removeWhiteSpace = (str: string) => {
  return str.replace(/\s/g, '');
};

export const getSourceLabel = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return 'Parent';
    case 'Implementation':
      return 'Interface';
    case 'Dependency':
      return 'Supplier';
    case 'Aggregation':
    case 'Composition':
      return 'Whole';
    default:
      return 'Source';
  }
};

export const getTargetLabel = (type: RelationshipType) => {
  switch (type) {
    case 'Inheritance':
      return 'Child';
    case 'Implementation':
      return 'Class';
    case 'Dependency':
      return 'Client';
    case 'Aggregation':
    case 'Composition':
      return 'Part';
    default:
      return 'Target';
  }
};

export const getSourcePermittedEntities = (type: RelationshipType) => {
  switch (type) {
    case 'Implementation':
      return ['interface'];
    case 'Dependency':
      return ['class', 'interface', 'enum'];
    case 'Inheritance':
    case 'Aggregation':
    case 'Composition':
    case 'Association':
      return ['class', 'interface'];
    default:
      return [];
  }
};

export const getTargetPermittedEntities = (type: RelationshipType) => {
  switch (type) {
    case 'Implementation':
      return ['class'];
    case 'Inheritance':
    case 'Dependency':
      return ['class', 'interface'];
    case 'Aggregation':
    case 'Composition':
    case 'Association':
      return ['class', 'interface', 'enum'];
    default:
      return [];
  }
};

export const umlMultiplicityRegex = /^(?:\d+|\d+\.\.\*|\d+\.\.\d+|\*|)$/;
