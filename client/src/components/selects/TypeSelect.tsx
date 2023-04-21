import { DataTypes } from '../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

interface TypeSelectProps extends GenericSelectProps<DataTypes> {
  forMethod?: boolean;
}

function TypeSelect({
  option,
  setOption,
  error,
  forMethod = false,
}: TypeSelectProps) {
  const types: DataTypes[] = [
    'int',
    'float',
    'double',
    'char',
    'boolean',
    'string',
    forMethod ? 'void' : null,
  ];

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