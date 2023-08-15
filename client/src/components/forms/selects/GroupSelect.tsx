/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, TextField } from '@mui/material';
import { useEntities } from '../../../context/EntitiesContext';
import { types } from './TypeSelect';

type GroupSelectProps = {
  option: string;
  setOption: (option: string) => void;
  label: string;
  width?: number;
  includePrimitives?: boolean;
  includeClasses?: boolean;
  includeInterfaces?: boolean;
  includeEnums?: boolean;
  restrictOptions?: boolean;
};

type GroupOption = {
  type: string | undefined;
  name: string;
};

function GroupSelect({
  option,
  setOption,
  label,
  width = 250,
  includePrimitives = false,
  includeClasses = false,
  includeInterfaces = false,
  includeEnums = false,
  restrictOptions = false,
}: GroupSelectProps) {
  const entities = useEntities();

  const classes: GroupOption[] = includeClasses
    ? entities
        .filter((e) => e.type === 'class')
        .map((e) => ({ type: e.type, name: e.data.name }))
    : [];
  const interfaces: GroupOption[] = includeInterfaces
    ? entities
        .filter((e) => e.type === 'interface')
        .map((e) => ({ type: e.type, name: e.data.name }))
    : [];
  const enums: GroupOption[] = includeEnums
    ? entities
        .filter((e) => e.type === 'enum')
        .map((e) => ({ type: e.type, name: e.data.name }))
    : [];
  const prims = includePrimitives
    ? types.map((t) => ({ type: 'primitive', name: t }))
    : [];

  const options = [...prims, ...classes, ...interfaces, ...enums];

  return (
    <Autocomplete
      id={`${label}-select`}
      freeSolo={!restrictOptions}
      options={options}
      value={{ name: option, type: undefined }}
      onInputChange={(e, value) => {
        setOption(value);
      }}
      getOptionLabel={(opt) => (opt as GroupOption).name}
      groupBy={(opt) => opt.type || ''}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="standard"
          required
          sx={{ width }}
        />
      )}
    />
  );
}

export default GroupSelect;
