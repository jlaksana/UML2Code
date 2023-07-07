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
export type Entity<T extends NodeData> = Node<T>;

export type NodeData = Klass | Interface | Enum;

export type Klass = {
  name: string;
  isAbstract: boolean;
  constants?: Constant[];
  attributes?: Attribute[];
  methods?: Method[];
};

export type Interface = {
  id: string;
  name: string;
  constants?: Constant[];
  methods?: Method[];
};

// TODO: add more to these defintions
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
