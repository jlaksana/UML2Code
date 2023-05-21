import { Entity, EntityAction } from '../types';

const validateActionType = (type: string | undefined, expected: string) => {
  if (!type) throw new Error('No entity type provided');
  if (type !== expected)
    throw new Error(`Wrong entity type. Expect '${expected}' but got ${type}`);
};

export default function entitiesReducer(
  entities: Entity[],
  action: EntityAction
) {
  switch (action.type) {
    // class actions
    case 'ADD_KLASS':
      validateActionType(action.payload.type, 'class');
      return [...entities, action.payload];
    case 'DELETE_KLASS':
      validateActionType(action.payload.type, 'class');
      return entities.filter((entity) => entity.id !== action.payload.id);
    case 'UPDATE_KLASS':
      validateActionType(action.payload.type, 'class');
      return entities.map((entity) =>
        entity.id === action.payload.id ? action.payload : entity
      );
    // TODO interface actions
    // TODO enum actions
    // use to update node positions
    case 'UPDATE_NODES':
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
