import { Document, Schema, model } from 'mongoose';
import { IDiagram } from './diagram';
import { IEntity } from './entity';

export type RelationshipVariant =
  | 'inheritance'
  | 'association'
  | 'aggregation'
  | 'composition'
  | 'realization'
  | 'dependency';

interface IRelationship extends Document {
  variant: RelationshipVariant;
  diagramId: IDiagram['_id'];
  src: IEntity['_id'];
  src_name: string;
  src_multi: string;
  tar: IEntity['_id'];
  tar_name: string;
  tar_multi: string;
}

const relationshipSchema = new Schema<IRelationship>({
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
  src_name: { type: String, required: true },
  src_multi: { type: String, required: true },
  tar: { type: Schema.Types.ObjectId, ref: 'Entity', required: true },
  tar_name: { type: String, required: true },
  tar_multi: { type: String, required: true },
});

// validate diagramId to be an existing diagram
relationshipSchema.path('diagramId').validate(async (diagramId) => {
  const diagram = await model<IDiagram>('Diagram').findById(diagramId);
  return !!diagram;
}, 'Invalid diagram ID');

// validate src to be an existing entity
relationshipSchema.path('src').validate(async (src) => {
  const entity = await model<IEntity>('Entity').findById(src);
  return !!entity;
}, 'Invalid source entity ID');

// validate tar to be an existing entity
relationshipSchema.path('tar').validate(async (tar) => {
  const entity = await model<IEntity>('Entity').findById(tar);
  return !!entity;
}, 'Invalid target entity ID');

const Relationship = model<IRelationship>('Relationship', relationshipSchema);

export default Relationship;
export { IRelationship };
