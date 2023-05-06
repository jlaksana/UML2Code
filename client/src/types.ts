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
};

export type Interface = {
  name: string;
};

export type Enum = {
  name: string;
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
