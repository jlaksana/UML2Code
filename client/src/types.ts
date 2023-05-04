export type DataTypes =
  | ''
  | 'int'
  | 'float'
  | 'double'
  | 'boolean'
  | 'string'
  | 'char'
  | 'void';

export type Visibility = '+' | '-' | '#';

// TODO: add more to these defintions
export type Klass = {
  name: string;
};

export type Interface = {
  name: string;
};

export type Enum = {
  name: string;
};
