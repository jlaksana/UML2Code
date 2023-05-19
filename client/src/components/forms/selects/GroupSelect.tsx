import { ListSubheader, MenuItem, TextField } from '@mui/material';
import { Enum, Interface, Klass } from '../../../types';
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
      id: '1',
      name: 'class1',
      isAbstract: false,
      constants: [],
      attributes: [],
      methods: [],
    },
    {
      id: '2',
      name: 'class2',
      isAbstract: false,
      constants: [],
      attributes: [],
      methods: [],
    },
  ];
  const interfaces: Interface[] = [
    {
      id: '1',
      name: 'interface',
    },
    {
      id: '2',
      name: 'interface2',
    },
  ];
  const enums: Enum[] = [
    {
      id: '1',
      name: 'enum',
      values: [],
    },
    {
      id: '2',
      name: 'enum2',
      values: [],
    },
  ];
  const isError = error && !option;

  return (
    <TextField
      id={`${label}-select`}
      variant="standard"
      select
      label={label}
      value={option}
      onChange={(e) => {
        setOption(e.target.value);
      }}
      sx={{ width }}
      error={isError}
      helperText={isError ? 'Required *' : ''}
      SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 400 } } } }}
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
    </TextField>
  );
}

export default GroupSelect;
