/* eslint-disable @typescript-eslint/no-use-before-define */
import pick from 'lodash.pick';
import { Document } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { Relationship, RelationshipModel } from '../models/relationship.model';

const relationshipUISchema = z
  .object({
    type: z.enum([
      'Inheritance',
      'Association',
      'Aggregation',
      'Composition',
      'Realization',
      'Dependency',
    ]),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
    srcMultiplicity: z
      .string()
      .regex(/^(?:\d+|\d+\.\.\*|\*|)$/)
      .optional(),
    tgtMultiplicity: z
      .string()
      .regex(/^(?:\d+|\d+\.\.\*|\*|)$/)
      .optional(),
  })
  .strict();

const validateRelationship = async (data: unknown, diagramId: string) => {
  console.log(data);
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
    parsedDataFromUI.data.type
  );

  // validate duplicate relationship
  if (
    await hasDuplicateRelationship(
      diagramId,
      parsedDataFromUI.data.type,
      sourceId,
      targetId
    )
  ) {
    throw new Error(
      'Diagram already has a relationship of this type and entities'
    );
  }

  const reformattedData = {
    type: parsedDataFromUI.data.type,
    diagramId: parseInt(diagramId, 10),
    source: sourceId,
    target: targetId,
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
  relationshipType: string
) => {
  const sourceEntity = await EntityModel.findOne({
    diagramId,
    'data.name': sourceName,
  });
  const targetEntity = await EntityModel.findOne({
    diagramId,
    'data.name': targetName,
  });
  if (!sourceEntity || !targetEntity) {
    throw new Error('Invalid source or target');
  }

  try {
    if (sourceEntity.type === 'enum') {
      throw new Error();
    }
    switch (relationshipType) {
      case 'Realization':
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
          sourceEntity.type !== targetEntity.type
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
      case 'Dependency':
        if (sourceEntity.type !== 'class') {
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

const reformatRelationship = (relationship: Document<Relationship>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reformattedRelationship: any = relationship.toObject();

  // rename _id to id
  reformattedRelationship.id = reformattedRelationship._id;

  switch (reformattedRelationship.type) {
    case 'Inheritance':
    case 'Realization':
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

const hasDuplicateRelationship = async (
  diagramId: string,
  type: string,
  source: string,
  target: string
) => {
  // only allow one relationship of type Inheritance, Realization, or Dependency
  if (
    type !== 'Inheritance' &&
    type !== 'Realization' &&
    type !== 'Dependency'
  ) {
    return false;
  }

  const relationship = await RelationshipModel.findOne({
    diagramId,
    type,
    source,
    target,
  });
  return relationship !== null;
};

export { reformatRelationship, validateRelationship };
