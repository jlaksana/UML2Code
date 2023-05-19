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

export type Entity = Klass | Interface | Enum;

// TODO: add more to these defintions
export type Klass = {
  id: string;
  name: string;
  isAbstract: boolean;
  constants: Constant[];
  attributes: Attribute[];
  methods: Method[];
};

export type Interface = {
  id: string;
  name: string;
};

export type Enum = {
  id: string;
  name: string;
  values: EnumValue[];
};

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

export type EntityAction = KlassAction | InterfaceAction | EnumAction;

type KlassAction = {
  type: 'ADD_KLASS' | 'DELETE_KLASS' | 'UPDATE_KLASS';
  payload: Klass;
};

type InterfaceAction = {
  type: 'ADD_INTERFACE' | 'DELETE_INTERFACE' | 'UPDATE_INTERFACE';
  payload: Interface;
};

type EnumAction = {
  type: 'ADD_ENUM' | 'DELETE_ENUM' | 'UPDATE_ENUM';
  payload: Enum;
};
