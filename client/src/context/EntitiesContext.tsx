import { Dispatch, createContext, useContext, useReducer } from 'react';
import { Entity, EntityAction } from '../types';
import entitiesReducer from './EntitiesReducer';

const EntitiesContext = createContext<Entity[] | null>(null);
const EntitiesDispatchContext = createContext<Dispatch<EntityAction> | null>(
  null
);

const getInitialEntities = (diagramId: string | undefined) => {
  if (diagramId) {
    return () => {
      // return entities from server
      // TODO: implement
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return testInitialEntities;
    };
  }
  throw new Error('diagramId is not defined');
};

export function EntitiesProvider({
  children,
  diagramId,
}: {
  children: React.ReactNode;
  diagramId: string | undefined;
}) {
  const [entities, dispatch] = useReducer(
    entitiesReducer,
    [],
    getInitialEntities(diagramId)
  );

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

// ! FOR TESTING PURPOSES ONLY
const testInitialEntities: Entity[] = [
  {
    id: '1',
    type: 'class',
    position: { x: 100, y: 100 },
    data: {
      name: 'Shape',
      isAbstract: true,
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
      ],
      attributes: [
        { id: 1, name: 'xPos', type: 'int', visibility: '—' },
        { id: 2, name: 'yPos', type: 'int', visibility: '—' },
      ],
      methods: [
        {
          id: 1,
          name: 'getXPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 2,
          name: 'getYPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 3,
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 4,
          name: 'area',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
      ],
    },
  },
  {
    id: '2',
    type: 'class',
    position: { x: 500, y: 500 },
    data: {
      name: 'Square',
      isAbstract: false,
      attributes: [
        { id: 1, name: 'xPos', type: 'int', visibility: '—' },
        { id: 2, name: 'yPos', type: 'int', visibility: '—' },
        { id: 3, name: 'sideLength', type: 'int', visibility: '—' },
      ],
      methods: [
        {
          id: 1,
          name: 'getXPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 2,
          name: 'getYPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 3,
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 4,
          name: 'area',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 5,
          name: 'getFormula',
          returnType: 'string',
          visibility: '+',
          isStatic: true,
        },
      ],
    },
  },
];
