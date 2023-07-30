import { ListSubheader, MenuItem, TextField } from '@mui/material';
import { useEntities } from '../../../context/EntitiesContext';
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
  const entities = useEntities();

  // TODO: get classes, interfaces, enums from context
  const classes: string[] = entities
    .filter((e) => e.type === 'class')
    .map((e) => e.data.name);
  const interfaces: string[] = entities
    .filter((e) => e.type === 'interface')
    .map((e) => e.data.name);
  const enums: string[] = entities
    .filter((e) => e.type === 'enum')
    .map((e) => e.data.name);

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
          <MenuItem key={opt} value={opt}>
            {opt}
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
          <MenuItem key={opt} value={opt}>
            {opt}
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
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
    </TextField>
  );
}

export default GroupSelect;
