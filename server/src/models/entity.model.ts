/* eslint-disable func-names */
import { Document, Schema, model } from 'mongoose';
import { z } from 'zod';
import { DiagramModel } from './diagram.model';

const entityConstant = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.string().min(1),
});

const entityAttribute = z.object({
  id: z.number(),
  name: z.string().min(1),
  visibility: z.enum(['+', '—', '#']),
  type: z.string().min(1),
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
  diagramId: z.instanceof(Schema.Types.ObjectId),
  type: z.enum(['class', 'interface', 'enum']),
  position: z.object({ x: z.number(), y: z.number() }),
  data: entityData,
});

type Entity = z.infer<typeof entitySchema> & Document;

const schema = new Schema<Entity>({
  diagramId: { type: Schema.Types.ObjectId, ref: 'Diagram', required: true },
  type: {
    type: String,
    enum: ['class', 'interface', 'enum'],
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
  const diagram = await DiagramModel.findById(value);
  return !!diagram;
}, 'Invalid diagram ID');

// update diagram updatedAt on save
schema.pre<Entity>(
  ['save', 'findOneAndUpdate', 'findOneAndDelete'],
  async function (next) {
    await DiagramModel.findByIdAndUpdate(this.diagramId, {
      updatedAt: Date.now(),
    });
    next();
  }
);

const EntityModel = model<Entity>('Entity', schema);

export { Entity, EntityModel, entityData, entitySchema };
