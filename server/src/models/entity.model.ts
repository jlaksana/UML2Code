import { Document, Schema, model } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from './diagram.model';

const entityConstant = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.enum(['int', 'string', 'char', 'bool', 'float', 'double']),
});

const entityAttribute = z.object({
  id: z.number(),
  name: z.string().min(1),
  visibility: z.enum(['+', '—', '#']),
  type: z.enum(['int', 'string', 'char', 'bool', 'float', 'double']),
});

const entityMethod = z.object({
  id: z.number(),
  name: z.string().min(1),
  returnType: z.string(),
  visibility: z.enum(['+', '—', '#']),
  isStatic: z.boolean(),
});

const entityData = z.object({
  name: z.string().min(1),
  isAbstract: z.boolean().optional(),
  constants: z.array(entityConstant).optional(),
  attributes: z.array(entityAttribute).optional(),
  methods: z.array(entityMethod).optional(),
});

const entitySchema = z.object({
  diagramId: z.number().min(1000).max(9999),
  type: z.enum(['class', 'interface', 'enum', 'abstract']),
  position: z.object({ x: z.number(), y: z.number() }),
  data: entityData,
});

type Entity = z.infer<typeof entitySchema> & Document;

const schema = new Schema<Entity>({
  diagramId: { type: Number, ref: 'Diagram', required: true },
  type: {
    type: String,
    enum: ['class', 'interface', 'enum', 'abstract'],
    required: true,
  },
  position: {
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
  },
  data: {
    name: { type: String, required: true },
    isAbstract: { type: Boolean, default: false },
    constants: [
      {
        _id: false,
        id: { type: Number, required: true },
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ['int', 'string', 'char', 'bool', 'float', 'double'],
          required: true,
        },
      },
    ],
    attributes: [
      {
        _id: false,
        id: { type: Number, required: true },
        name: { type: String, required: true },
        visibility: { type: String, enum: ['+', '—', '#'], required: true },
        type: {
          type: String,
          enum: ['int', 'string', 'char', 'bool', 'float', 'double'],
          required: true,
        },
      },
    ],
    methods: [
      {
        _id: false,
        id: { type: Number, required: true },
        name: { type: String, required: true },
        isStatic: { type: Boolean, default: false },
        visibility: { type: String, enum: ['+', '—', '#'], required: true },
        returnType: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (value) => {
  const count = await DiagramModel.countDocuments({ _id: value });
  return count === 1;
}, 'Invalid diagram ID');

const EntityModel = model<Entity>('Entity', schema);

export { entitySchema, Entity, EntityModel, entityData };
