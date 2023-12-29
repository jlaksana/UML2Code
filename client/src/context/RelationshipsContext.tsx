import { Dispatch, createContext, useContext, useReducer } from 'react';
import { Relationship } from '../types';
import relationshipsReducer, {
  RelationshipAction,
} from './RelationshipsReducer';

const RelationshipsContext = createContext<Relationship[] | null>(null);
const RelationshipsDispatchContext =
  createContext<Dispatch<RelationshipAction> | null>(null);

export function RelationshipsProvider({
  value,
  children,
}: {
  value: Relationship[] | undefined;
  children: React.ReactNode;
}) {
  const [relationships, dispatch] = useReducer(
    relationshipsReducer,
    value || []
  );

  return (
    <RelationshipsContext.Provider value={relationships}>
      <RelationshipsDispatchContext.Provider value={dispatch}>
        {children}
      </RelationshipsDispatchContext.Provider>
    </RelationshipsContext.Provider>
  );
}

// hook to retrieve relationships from context
export function useRelationships() {
  const relationships = useContext(RelationshipsContext);
  if (!relationships) {
    throw new Error(
      'useRelationships must be used within a RelationshipsProvider'
    );
  }
  return relationships;
}

// hook to retrieve relationships dispatch from context. See RelationshipsReducer.tsx for valid actions
export function useRelationshipsDispatch() {
  const dispatch = useContext(RelationshipsDispatchContext);
  if (!dispatch) {
    throw new Error(
      'useRelationshipsDispatch must be used within a RelationshipsDispatchProvider'
    );
  }
  return dispatch;
}
