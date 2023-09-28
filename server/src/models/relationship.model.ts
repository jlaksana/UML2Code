import { Document, Schema, model } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from './diagram.model';
import { EntityModel } from './entity.model';

const RelationshipVariant = z.enum([
  'Inheritance',
  'Association',
  'Aggregation',
  'Composition',
  'Realization',
  'Dependency',
]);

const HandlePositions = z.enum([
  'bottom-left',
  'bottom-middle',
  'bottom-right',
  'right-middle',
  'left-bottom',
  'right-bottom',
  'top-left',
  'top-middle',
  'top-right',
  'left-top',
  'left-middle',
  'right-top',
]);

const umlMultiplicityRegex = /^(?:\d+|\d+\.\.\*|\d+\.\.\d+|\*|)$/;

const relationshipSchema = z.object({
  type: RelationshipVariant,
  diagramId: z.number().min(1000).max(999999),
  source: z.instanceof(Schema.Types.ObjectId),
  target: z.instanceof(Schema.Types.ObjectId),
  sourceHandle: HandlePositions.optional(),
  targetHandle: HandlePositions.optional(),
  data: z
    .object({
      label: z.string().optional(),
      srcMultiplicity: z.string().regex(umlMultiplicityRegex).optional(),
      tgtMultiplicity: z.string().regex(umlMultiplicityRegex).optional(),
    })
    .optional(),
});

type Relationship = z.infer<typeof relationshipSchema> & Document;

const schema = new Schema<Relationship>({
  type: {
    type: String,
    enum: [
      'Inheritance',
      'Association',
      'Aggregation',
      'Composition',
      'Realization',
      'Dependency',
    ],
    required: true,
  },
  diagramId: { type: Number, ref: 'Diagram', required: true },
  source: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  target: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  sourceHandle: {
    type: String,
    enum: [
      'bottom-left',
      'bottom-middle',
      'bottom-right',
      'right-top',
      'right-middle',
      'right-bottom',
      'top-left',
      'top-middle',
      'top-right',
      'left-top',
      'left-middle',
      'left-bottom',
    ],
    default: 'bottom-middle',
  },
  targetHandle: {
    type: String,
    enum: [
      'bottom-left',
      'bottom-middle',
      'bottom-right',
      'right-top',
      'right-middle',
      'right-bottom',
      'top-left',
      'top-middle',
      'top-right',
      'left-top',
      'left-middle',
      'left-bottom',
    ],
    default: 'top-middle',
  },
  data: {
    label: { type: String, default: '' },
    srcMultiplicity: { type: String, default: '' },
    tgtMultiplicity: { type: String, default: '' },
  },
});

// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (diagramId) => {
  const diagram = await DiagramModel.findById(diagramId);
  return !!diagram;
}, 'Invalid diagram ID');

// validate src to be an existing entity
schema.path('source').validate(async (src) => {
  const entity = await EntityModel.findById(src);
  return !!entity;
}, 'Invalid source entity ID');

// validate tar to be an existing entity
schema.path('target').validate(async (tar) => {
  const entity = await EntityModel.findById(tar);
  return !!entity;
}, 'Invalid target entity ID');

const RelationshipModel = model<Relationship>('Relationship', schema);

export {
  HandlePositions,
  Relationship,
  RelationshipModel,
  RelationshipVariant,
  relationshipSchema,
  umlMultiplicityRegex,
};
