import { Node } from 'reactflow';

export type DataType =
  | ''
  | 'int'
  | 'float'
  | 'double'
  | 'boolean'
  | 'string'
  | 'char'
  | 'void';

export type Visibility = '+' | '—' | '#';

// Entity is a node in the graph where its data can be a class, interface, or enum
export type Entity = Node<Klass | Interface | Enum>;

export type Klass = {
  name: string;
  isAbstract: boolean;
  constants?: Constant[];
  attributes?: Attribute[];
  methods?: Method[];
};

// TODO: add more to these defintions
export type Interface = {
  id: string;
  name: string;
};

export type Enum = {
  id: string;
  name: string;
  values: EnumValue[];
};

// field type definitions
export type Constant = {
  id: number;
  name: string;
  type: DataType;
};

export type Attribute = {
  id: number;
  name: string;
  type: DataType;
  visibility: Visibility;
};

export type Method = {
  id: number;
  name: string;
  returnType: string;
  visibility: Visibility;
  isStatic: boolean;
};

export type EnumValue = {
  id: number;
  name: string;
};

// reducer action definitions
export type EntityAction =
  | KlassAction
  | InterfaceAction
  | EnumAction
  | NodeAction;

type KlassAction = {
  type: 'ADD_KLASS' | 'DELETE_KLASS' | 'UPDATE_KLASS';
  payload: Klass;
  id?: string;
};

type InterfaceAction = {
  type: 'ADD_INTERFACE' | 'DELETE_INTERFACE' | 'UPDATE_INTERFACE';
  payload: Entity;
};

type EnumAction = {
  type: 'ADD_ENUM' | 'DELETE_ENUM' | 'UPDATE_ENUM';
  payload: Entity;
};

type NodeAction = {
  type: 'UPDATE_NODES' | 'END_UPDATE_NODES';
  payload: Entity[];
};
