import { Entity, Enum, Interface, Klass, NodeData } from '../types';

export type EntityAction =
  | KlassAction
  | InterfaceAction
  | EnumAction
  | NodeAction;

type KlassAction = {
  type: 'ADD_KLASS' | 'DELETE_KLASS' | 'UPDATE_KLASS';
  payload: Entity<Klass> | null;
  id?: string;
};

type InterfaceAction = {
  type: 'ADD_INTERFACE' | 'DELETE_INTERFACE' | 'UPDATE_INTERFACE';
  payload: Entity<Interface> | null;
  id?: string;
};

type EnumAction = {
  type: 'ADD_ENUM' | 'DELETE_ENUM' | 'UPDATE_ENUM';
  payload: Entity<Enum> | null;
  id?: string;
};

type NodeAction = {
  type: 'SET_NODES' | 'UPDATE_NODES' | 'END_UPDATE_NODES';
  payload: Entity<NodeData>[];
};

export default function entitiesReducer(
  entities: Entity<NodeData>[],
  action: EntityAction
): Entity<NodeData>[] {
  switch (action.type) {
    // add actions
    case 'ADD_KLASS':
    case 'ADD_INTERFACE':
    case 'ADD_ENUM':
      if (!action.payload) return entities;
      return [...entities, action.payload];
    // delete actions
    case 'DELETE_KLASS':
    case 'DELETE_INTERFACE':
    case 'DELETE_ENUM':
      return entities.filter((entity) => entity.id !== action.id);
    // update actions
    case 'UPDATE_KLASS':
    case 'UPDATE_INTERFACE':
    case 'UPDATE_ENUM':
      if (!action.payload) return entities;
      return entities.map((entity) =>
        entity.id === action.id ? action.payload : entity
      ) as Entity<NodeData>[];
    // node actions
    case 'SET_NODES':
      // this case handles when the user first loads the diagram
      return action.payload;
    case 'UPDATE_NODES':
      // this case handles when the user is dragging a node or any other change
      // that does not require updating the node positions in the database
      return action.payload;
    case 'END_UPDATE_NODES':
      // this case handles when the user stops dragging a node
      // it is used to update the node positions in the database
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}
