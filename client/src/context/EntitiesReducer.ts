import { Entity, EntityAction } from '../types';

export default function entitiesReducer(
  entities: Entity[],
  action: EntityAction
): Entity[] {
  switch (action.type) {
    // class actions
    case 'ADD_KLASS': {
      // TODO: post to server here
      const newKlass = {
        id: action.payload.name,
        type: 'class',
        position: { x: 0, y: 0 },
        data: action.payload,
      };
      return [...entities, newKlass];
    }
    case 'DELETE_KLASS':
      return entities.filter((entity) => entity.id !== action.id);
    case 'UPDATE_KLASS':
      return entities.map((entity) =>
        entity.id === action.id ? { ...entity, data: action.payload } : entity
      );
    // TODO interface actions
    // TODO enum actions
    // use to update node positions
    case 'UPDATE_NODES':
      // this case handles when the user is dragging a node or any other change
      // that does not require updating the node positions in the database
      return action.payload;
    case 'END_UPDATE_NODES':
      // this case handles when the user stops dragging a node
      // it is used to update the node positions in the database
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
