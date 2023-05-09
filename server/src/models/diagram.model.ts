import { Document, Schema, model } from 'mongoose';
import { z } from 'zod';

const diagramSchema = z.object({
  _id: z.coerce.number().min(1000).max(9999),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type Diagram = z.infer<typeof diagramSchema> & Document;

const schema = new Schema<Diagram>(
  {
    _id: {
      type: Number,
      min: 1000,
      max: 9999,
    },
  },
  { timestamps: true }
);

const DiagramModel = model<Diagram>('Diagram', schema);

// Counter schema to generate unique diagram id
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, min: 1000, max: 9999 },
});

const CounterModel = model('Counter', counterSchema);

export { diagramSchema, Diagram, DiagramModel, CounterModel };
