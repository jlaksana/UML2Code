/* eslint-disable @typescript-eslint/no-use-before-define */
import pick from 'lodash.pick';
import { z } from 'zod';
import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import {
  HandlePositions,
  Relationship,
  RelationshipModel,
  RelationshipVariant,
  umlMultiplicityRegex,
} from '../models/relationship.model';

const relationshipUISchema = z.object({
  type: z.enum([
    'Inheritance',
    'Association',
    'Aggregation',
    'Composition',
    'Implementation',
    'Dependency',
  ]),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
  srcMultiplicity: z.string().regex(umlMultiplicityRegex).optional(),
  tgtMultiplicity: z.string().regex(umlMultiplicityRegex).optional(),
});

const validateRelationship = async (
  data: unknown,
  diagramId: string,
  isUpdate: boolean
) => {
  if (diagramId === undefined) {
    throw new Error('Must provide a diagram id');
  }
  // validate all fields are present and valid
  const parsedDataFromUI = relationshipUISchema.safeParse(data);
  if (!parsedDataFromUI.success) {
    throw new Error('Invalid - Ensure all fields are present and valid');
  } else {
    // query for the diagram
    try {
      const diagram = await DiagramModel.findById(diagramId);
      if (!diagram) {
        throw new Error();
      }
    } catch (e) {
      throw new Error(
        `Could not find a diagram with the given id: ${diagramId}`
      );
    }
  }

  // validate source and target
  const { sourceId, targetId } = await validateSourceAndTarget(
    parsedDataFromUI.data.source,
    parsedDataFromUI.data.target,
    diagramId,
    parsedDataFromUI.data.type,
    isUpdate
  );

  const reformattedData = {
    type: parsedDataFromUI.data.type,
    diagramId: parseInt(diagramId, 10),
    source: sourceId,
    target: targetId,
    sourceHandle: parsedDataFromUI.data.sourceHandle,
    targetHandle: parsedDataFromUI.data.targetHandle,
    data: {
      label: parsedDataFromUI.data.label,
      srcMultiplicity: parsedDataFromUI.data.srcMultiplicity,
      tgtMultiplicity: parsedDataFromUI.data.tgtMultiplicity,
    },
  };

  return reformattedData;
};

const validateSourceAndTarget = async (
  sourceName: string,
  targetName: string,
  diagramId: string,
  relationshipType: string,
  isHandleUpdate: boolean
) => {
  let sourceEntity;
  let targetEntity;
  if (isHandleUpdate) {
    sourceEntity = await EntityModel.findById(sourceName);
    targetEntity = await EntityModel.findById(targetName);
  } else {
    sourceEntity = await EntityModel.findOne({
      diagramId,
      'data.name': sourceName,
    });
    targetEntity = await EntityModel.findOne({
      diagramId,
      'data.name': targetName,
    });
  }
  if (!sourceEntity || !targetEntity) {
    throw new Error('Invalid source or target');
  }

  try {
    switch (relationshipType) {
      case 'Implementation':
        if (
          sourceEntity._id.equals(targetEntity._id) ||
          sourceEntity.type !== 'interface' ||
          targetEntity.type !== 'class'
        ) {
          throw new Error();
        }
        break;
      case 'Inheritance':
        if (
          sourceEntity._id.equals(targetEntity._id) ||
          sourceEntity.type !== targetEntity.type ||
          sourceEntity.type === 'enum'
        ) {
          throw new Error();
        }
        break;
      case 'Composition':
        if (sourceEntity._id.equals(targetEntity._id)) {
          throw new Error();
        }
      // eslint-disable-next-line no-fallthrough
      case 'Association':
      case 'Aggregation':
        if (sourceEntity.type === 'enum') {
          throw new Error();
        }
        break;
      case 'Dependency':
        if (targetEntity.type === 'enum') {
          throw new Error();
        }
        break;
      default:
        throw new Error();
    }
  } catch (e) {
    throw new Error('Invalid source or target for relationship type');
  }

  return { sourceId: sourceEntity._id, targetId: targetEntity._id };
};

const reformatRelationship = (relationship: Relationship) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reformattedRelationship: any = relationship.toObject();

  // rename _id to id
  reformattedRelationship.id = reformattedRelationship._id;

  switch (reformattedRelationship.type) {
    case 'Inheritance':
    case 'Implementation':
    case 'Dependency':
      return pick(reformattedRelationship, [
        'id',
        'source',
        'target',
        'type',
        'sourceHandle',
        'targetHandle',
      ]);
    case 'Association':
    case 'Aggregation':
    case 'Composition':
      return pick(reformattedRelationship, [
        'id',
        'source',
        'target',
        'type',
        'sourceHandle',
        'targetHandle',
        'data',
      ]);
    default:
      throw new Error('Invalid relationship type');
  }
};

const validateDuplicateRelationship = async (
  diagramId: string,
  type: string,
  source: string,
  target: string,
  relationshipId?: string
) => {
  // only allow one relationship of type Inheritance, Implementation, or Dependency between two entities
  if (
    type !== 'Inheritance' &&
    type !== 'Implementation' &&
    type !== 'Dependency'
  ) {
    return true;
  }
  const relationship = await RelationshipModel.findOne({
    diagramId,
    type,
    source,
    target,
  });
  if (relationship !== null && relationship.id !== relationshipId) {
    throw new Error('Diagram already has a relationship of this type');
  }

  // an entity can only inherit from one entity
  if (type === 'Inheritance') {
    const relationship2 = await RelationshipModel.findOne({
      diagramId,
      type,
      target,
    });
    if (relationship2 !== null && relationship2.id !== relationshipId) {
      throw new Error('An entity can only inherit from one entity');
    }
  }
  return true;
};

const newConnectionSchema = z.object({
  type: RelationshipVariant,
  source: z.string(),
  sourceHandle: HandlePositions,
  target: z.string(),
  targetHandle: HandlePositions,
});

const validateRelationshipHandleUpdate = async (
  relationshipId: string,
  handleData: unknown,
  diagramId: string
) => {
  const parsedData = newConnectionSchema.safeParse(handleData);
  if (!parsedData.success) {
    throw new Error('Could not update relationship position');
  }

  // validate source and target
  const { sourceId, targetId } = await validateSourceAndTarget(
    parsedData.data.source,
    parsedData.data.target,
    diagramId,
    parsedData.data.type,
    true
  );

  await validateDuplicateRelationship(
    diagramId,
    parsedData.data.type,
    sourceId,
    targetId,
    relationshipId
  );

  return parsedData.data;
};

export {
  reformatRelationship,
  validateDuplicateRelationship,
  validateRelationship,
  validateRelationshipHandleUpdate,
};
