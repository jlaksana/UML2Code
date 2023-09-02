import { Entity } from '../types';

export type EntityAction =
  | {
      type: 'ADD_ENTITY' | 'UPDATE_ENTITY';
      payload: Entity;
    }
  | {
      type: 'DELETE_ENTITY';
      id: string;
    }
  | {
      type: 'SET_ENTITIES';
      payload: Entity[];
    };

export default function entitiesReducer(
  entities: Entity[],
  action: EntityAction
): Entity[] {
  switch (action.type) {
    // add actions
    case 'ADD_ENTITY':
      return [...entities, action.payload];
    // delete actions
    case 'DELETE_ENTITY':
      return entities.filter((entity) => entity.id !== action.id);
    // update actions
    case 'UPDATE_ENTITY':
      if (!action.payload) return entities;
      return entities.map((entity) =>
        entity.id === action.payload?.id ? action.payload : entity
      ) as Entity[];
    case 'SET_ENTITIES':
      return action.payload;

    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}
