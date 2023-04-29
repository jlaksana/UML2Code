import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from './diagram.model';
import { EntityModel } from './entity.model';

const RelationshipVariant = z.enum([
  'inheritance',
  'association',
  'aggregation',
  'composition',
  'realization',
  'dependency',
]);

const relationshipSchema = z.object({
  variant: RelationshipVariant,
  diagramId: z.number().min(1000).max(9999),
  src: z.instanceof(Schema.Types.ObjectId),
  src_name: z.string().optional(),
  src_multi: z.string().optional(),
  tar: z.instanceof(Schema.Types.ObjectId),
  tar_name: z.string().optional(),
  tar_multi: z.string().optional(),
});

type Relationship = z.infer<typeof relationshipSchema> & Document;

const schema = new Schema<Relationship>({
  variant: {
    type: String,
    enum: [
      'inheritance',
      'association',
      'aggregation',
      'composition',
      'realization',
      'dependency',
    ],
    required: true,
  },
  diagramId: { type: Number, ref: 'Diagram', required: true },
  src: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  src_name: { type: String },
  src_multi: { type: String },
  tar: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  tar_name: { type: String },
  tar_multi: { type: String },
});

// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (diagramId) => {
  const diagram = await DiagramModel.findById(diagramId);
  return !!diagram;
}, 'Invalid diagram ID');

// validate src to be an existing entity
schema.path('src').validate(async (src) => {
  const entity = await EntityModel.findById(src);
  return !!entity;
}, 'Invalid source entity ID');

// validate tar to be an existing entity
schema.path('tar').validate(async (tar) => {
  const entity = await EntityModel.findById(tar);
  return !!entity;
}, 'Invalid target entity ID');

const RelationshipModel = model<Relationship>('Relationship', schema);

export { relationshipSchema, Relationship, RelationshipModel };
