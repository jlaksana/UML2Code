import { Document, Schema, model } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from './diagram.model';

const entityAttribute = z.object({
  name: z.string(),
  visibility: z.enum(['+', '-', '#']),
  type: z.enum(['int', 'string', 'char', 'bool', 'float', 'double']),
  isConstant: z.boolean(),
});

const entityMethod = z.object({
  name: z.string(),
  isStatic: z.boolean(),
  visibility: z.enum(['+', '-', '#']),
  retType: z.string(),
});

const entitySchema = z.object({
  variant: z.enum(['class', 'interface', 'enum', 'abstract']),
  name: z.string(),
  diagramId: z.number().min(1000).max(9999),
  x: z.number(),
  y: z.number(),
  attributes: z.array(entityAttribute),
  methods: z.array(entityMethod),
});

type Entity = z.infer<typeof entitySchema> & Document;

const schema = new Schema<Entity>({
  variant: {
    type: String,
    enum: ['class', 'interface', 'enum', 'abstract'],
    required: true,
  },
  name: { type: String, required: true },
  diagramId: { type: Number, ref: 'Diagram', required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  attributes: [
    {
      name: { type: String, required: true },
      visibility: { type: String, enum: ['+', '-', '#'], required: true },
      type: {
        type: String,
        enum: ['int', 'string', 'char', 'bool', 'float', 'double'],
        required: true,
      },
      isConstant: { type: Boolean, default: false },
    },
  ],
  methods: [
    {
      name: { type: String, required: true },
      isStatic: { type: Boolean, default: false },
      visibility: { type: String, enum: ['+', '-', '#'], required: true },
      retType: {
        type: String,
        required: true,
      },
    },
  ],
});

// create compound index
schema.index({ name: 1, diagramId: 1 }, { unique: true });

// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (value) => {
  const count = await DiagramModel.countDocuments({ _id: value });
  return count === 1;
}, 'Invalid diagram ID');

// validate attribute to have unique names in entity
schema.path('attributes').validate(async function validateAttr(value) {
  const names = value.map((attr: { name: string }) => attr.name);
  return names.length === new Set(names).size;
}, 'Attributes must have unique names');

const EntityModel = model<Entity>('Entity', schema);

export { entitySchema, Entity, EntityModel };
