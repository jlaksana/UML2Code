import mongoose, { Document, Schema, model } from 'mongoose';
import { IDiagram } from './diagram';

type EntityVariant = 'class' | 'interface' | 'enum' | 'abstract';

interface EntityAttribute {
  name: string;
  visibility: '+' | '-' | '#';
  type: 'int' | 'string' | 'char' | 'bool' | 'float' | 'double';
  isConstant: boolean;
}

interface EntityMethod {
  name: string;
  isStatic: boolean;
  visibility: '+' | '-' | '#';
  retType: string;
}

interface IEntity extends Document {
  variant: EntityVariant;
  name: string;
  diagramId: IDiagram['_id'];
  x: number;
  y: number;
  attributes: EntityAttribute[];
  methods: EntityMethod[];
}

const EntitySchema = new Schema<IEntity>({
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
EntitySchema.index({ name: 1, diagramId: 1 }, { unique: true });

// validate diagramId to be an existing diagram
EntitySchema.path('diagramId').validate(async (value) => {
  const count = await mongoose.models.Diagram.countDocuments({ _id: value });
  return count === 1;
}, 'Invalid diagram ID');

// validate attribute to have unique names in entity
EntitySchema.path('attributes').validate(async function validateAttr(
  value: EntityAttribute[]
) {
  const names = value.map((attr: EntityAttribute) => attr.name);
  return names.length === new Set(names).size;
},
'Attributes must have unique names');

const Entity = model<IEntity>('Entity', EntitySchema);

export default Entity;
export { IEntity };
