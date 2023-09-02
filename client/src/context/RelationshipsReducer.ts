import { Relationship } from '../types';

export type RelationshipAction =
  | {
      type: 'ADD_RELATIONSHIP';
      payload: Relationship;
    }
  | {
      type: 'UPDATE_RELATIONSHIP';
      payload: Relationship;
      id: string;
    }
  | {
      type: 'DELETE_RELATIONSHIP';
      id: string;
    }
  | {
      type: 'SET_RELATIONSHIPS';
      payload: Relationship[];
    };

export default function relationshipsReducer(
  relationships: Relationship[],
  action: RelationshipAction
): Relationship[] {
  switch (action.type) {
    case 'SET_RELATIONSHIPS':
      return action.payload;
    case 'ADD_RELATIONSHIP':
      return [...relationships, action.payload];
    case 'UPDATE_RELATIONSHIP':
      return relationships.map((r) =>
        r.id === action.payload.id ? action.payload : r
      );
    case 'DELETE_RELATIONSHIP':
      return relationships.filter((r) => r.id !== action.id);
    default:
      return relationships;
  }
}
