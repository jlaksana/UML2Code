import { ListSubheader, MenuItem, TextField } from '@mui/material';
import { Enum, Interface, Klass } from '../../../types';
import { types } from './TypeSelect';

interface GroupSelectProps {
  option: string;
  setOption: (option: string) => void;
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
  label,
  width = 300,
  includePrimitives = false,
  includeClasses = false,
  includeInterfaces = false,
  includeEnums = false,
}: GroupSelectProps) {
  // TODO: get classes, interfaces, enums from context
  const classes: Klass[] = [];
  const interfaces: Interface[] = [
    {
      name: 'interface',
    },
    {
      name: 'interface2',
    },
  ];
  const enums: Enum[] = [
    {
      name: 'enum',
      values: [],
    },
    {
      name: 'enum2',
      values: [],
    },
  ];

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
      required
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
