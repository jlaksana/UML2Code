import { Dispatch, createContext, useContext, useReducer } from 'react';
import { Entity, NodeData } from '../types';
import entitiesReducer, { EntityAction } from './EntitiesReducer';

const EntitiesContext = createContext<Entity<NodeData>[] | null>(null);
const EntitiesDispatchContext = createContext<Dispatch<EntityAction> | null>(
  null
);

export function EntitiesProvider({ children }: { children: React.ReactNode }) {
  const [entities, dispatch] = useReducer(entitiesReducer, []);

  return (
    <EntitiesContext.Provider value={entities}>
      <EntitiesDispatchContext.Provider value={dispatch}>
        {children}
      </EntitiesDispatchContext.Provider>
    </EntitiesContext.Provider>
  );
}

// hook to retrieve entities from context
export function useEntities() {
  const entities = useContext(EntitiesContext);
  if (!entities) {
    throw new Error('useEntities must be used within a EntitiesProvider');
  }
  return entities;
}

// hook to retrieve entities dispatch from context. See EntitiesReducer.tsx for valid actions
export function useEntitiesDispatch() {
  const dispatch = useContext(EntitiesDispatchContext);
  if (!dispatch) {
    throw new Error(
      'useEntitiesDispatch must be used within a EntitiesDispatchProvider'
    );
  }
  return dispatch;
}
