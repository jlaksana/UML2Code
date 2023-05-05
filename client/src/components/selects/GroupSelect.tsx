import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';
import { Enum, Interface, Klass } from '../../types';
import { types } from './TypeSelect';

interface GroupSelectProps {
  option: string;
  setOption: (option: string) => void;
  error: boolean;
  label: string;
  width?: number;
  includePrimitives?: boolean;
  includeClasses?: boolean;
  includeInterfaces?: boolean;
  includeEnums?: boolean;
}

function GroupSelect({
  option,
  setOption,
  error,
  label,
  width = 300,
  includePrimitives = false,
  includeClasses = false,
  includeInterfaces = false,
  includeEnums = false,
}: GroupSelectProps) {
  // TODO: get classes, interfaces, enums from context
  const classes: Klass[] = [
    {
      name: 'Test',
      isAbstract: false,
      constants: [],
    },
    {
      name: 'Test2',
      isAbstract: false,
      constants: [],
    },
  ];
  const interfaces: Interface[] = [
    {
      name: 'Test',
    },
    {
      name: 'Test2',
    },
  ];
  const enums: Enum[] = [
    {
      name: 'Test',
    },
    {
      name: 'Test2',
    },
  ];
  const isError = error && !option;

  return (
    <FormControl error={isError}>
      <InputLabel htmlFor={`${label}-select`}>{label}</InputLabel>
      <Select
        id={`${label}-select`}
        value={option}
        label={label}
        onChange={(e) => {
          setOption(e.target.value as string);
        }}
        sx={{ width }}
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
      >
        {includePrimitives && <ListSubheader>Primitives</ListSubheader>}
        {includePrimitives &&
          types.map((opt) => {
            return (
              <MenuItem key={opt as string} value={opt as string}>
                {opt}
              </MenuItem>
            );
          })}
        {includeClasses && (
          <div>
            <hr />
            <ListSubheader>Classes</ListSubheader>
          </div>
        )}
        {includeClasses &&
          classes.map((opt) => (
            <MenuItem key={opt.name} value={opt.name}>
              {opt.name}
            </MenuItem>
          ))}
        {includeInterfaces && (
          <div>
            <hr />
            <ListSubheader>Interfaces</ListSubheader>
          </div>
        )}
        {includeInterfaces &&
          interfaces.map((opt) => (
            <MenuItem key={opt.name} value={opt.name}>
              {opt.name}
            </MenuItem>
          ))}
        {includeEnums && (
          <div>
            <hr />
            <ListSubheader>Enums</ListSubheader>
          </div>
        )}
        {includeEnums &&
          enums.map((opt) => (
            <MenuItem key={opt.name} value={opt.name}>
              {opt.name}
            </MenuItem>
          ))}
      </Select>
      {isError ? <FormHelperText>Required *</FormHelperText> : null}
    </FormControl>
  );
}

export default GroupSelect;
