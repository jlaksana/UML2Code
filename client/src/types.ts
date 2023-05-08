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

// TODO: add more to these defintions
export type Klass = {
  name: string;
  isAbstract: boolean;
  constants: Constant[];
  attributes: Attribute[];
  methods: Method[];
};

export type Interface = {
  name: string;
};

export type Enum = {
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
