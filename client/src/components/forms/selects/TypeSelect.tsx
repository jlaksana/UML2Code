import { DataType } from '../../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

export const types: DataType[] = [
  'int',
  'float',
  'double',
  'char',
  'boolean',
  'string',
];

function TypeSelect({ option, setOption }: GenericSelectProps<DataType>) {
  return (
    <GenericSelect
      option={option}
      setOption={setOption}
      options={types}
      label="Type"
      width={90}
    />
  );
}

export default TypeSelect;
