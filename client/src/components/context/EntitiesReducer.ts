import { Entity, EntityAction } from '../../types';

export default function entitiesReducer(
  entities: Entity[],
  action: EntityAction
) {
  switch (action.type) {
    case 'ADD_KLASS':
      return [...entities, action.payload];
    case 'DELETE_KLASS':
      return entities.filter((entity) => entity.id !== action.payload.id);
    case 'UPDATE_KLASS':
      return entities.map((entity) =>
        entity.id === action.payload.id ? action.payload : entity
      );
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
