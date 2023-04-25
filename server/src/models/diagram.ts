import { Document, Schema, model } from 'mongoose';

interface IDiagram extends Document {
  _id: number;
  createdAt: Date;
  updatedAt: Date;
}

const diagramSchema = new Schema<IDiagram>(
  {
    _id: {
      type: Number,
      min: 1000,
      max: 9999,
    },
  },
  { timestamps: true }
);

const Diagram = model<IDiagram>('Diagram', diagramSchema);

export default Diagram;
export { IDiagram };
