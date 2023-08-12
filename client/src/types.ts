import { Node } from 'reactflow';

export type DataType =
  | ''
  | 'int'
  | 'float'
  | 'long'
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
  name: string;
  constants?: Constant[];
  methods?: Method[];
};

export type Enum = {
  name: string;
  values: EnumValue[];
};

// field type definitions
export type Constant = {
  id: number;
  name: string;
  type: string;
};

export type Attribute = {
  id: number;
  name: string;
  type: string;
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
