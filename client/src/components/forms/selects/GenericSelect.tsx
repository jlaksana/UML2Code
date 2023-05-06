import { MenuItem, TextField } from '@mui/material';

// props every select component will have
export type GenericSelectProps<T> = {
  option: T;
  setOption: (option: T) => void;
  error: boolean;
};

// props that are specific to this generic select component
interface GenericSelectOnlyProps<T> extends GenericSelectProps<T> {
  options: T[];
  label: string;
  width?: number;
}

function GenericSelect<T>({
  option,
  setOption,
  options,
  error,
  label,
  width = 300,
}: GenericSelectOnlyProps<T>) {
  const isError = error && !option;

  return (
    <TextField
      id={`${label}-select`}
      variant="standard"
      select
      label={label}
      value={option}
      onChange={(e) => {
        setOption(e.target.value as T);
      }}
      sx={{ width }}
      error={isError}
      helperText={isError ? 'Required *' : ''}
    >
      {options.map((opt) => {
        return (
          <MenuItem key={opt as string} value={opt as string}>
            {opt as string}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export default GenericSelect;
