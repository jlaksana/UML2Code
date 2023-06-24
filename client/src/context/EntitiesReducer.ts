import { Entity, Enum, Interface, Klass, NodeData } from '../types';

export type EntityAction =
  | KlassAction
  | InterfaceAction
  | EnumAction
  | NodeAction;

type KlassAction = {
  type: 'ADD_KLASS' | 'DELETE_KLASS' | 'UPDATE_KLASS';
  payload: Entity<Klass>;
  id?: string;
};

type InterfaceAction = {
  type: 'ADD_INTERFACE' | 'DELETE_INTERFACE' | 'UPDATE_INTERFACE';
  payload: Entity<Interface>;
};

type EnumAction = {
  type: 'ADD_ENUM' | 'DELETE_ENUM' | 'UPDATE_ENUM';
  payload: Entity<Enum>;
};

type NodeAction = {
  type: 'UPDATE_NODES' | 'END_UPDATE_NODES';
  payload: Entity<NodeData>[];
};

export default function entitiesReducer(
  entities: Entity<NodeData>[],
  action: EntityAction
): Entity<NodeData>[] {
  switch (action.type) {
    // class actions
    case 'ADD_KLASS': {
      return [...entities, action.payload];
    }
    case 'DELETE_KLASS':
      return entities.filter((entity) => entity.id !== action.id);
    case 'UPDATE_KLASS':
      return entities.map((entity) =>
        entity.id === action.id ? action.payload : entity
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
