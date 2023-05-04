import { DataTypes } from '../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

export const types: DataTypes[] = [
  'int',
  'float',
  'double',
  'char',
  'boolean',
  'string',
];

function TypeSelect({
  option,
  setOption,
  error,
}: GenericSelectProps<DataTypes>) {
  return (
    <GenericSelect
      option={option}
      setOption={setOption}
      options={types}
      error={error}
      label="Type"
      width={100}
    />
  );
}

export default TypeSelect;
