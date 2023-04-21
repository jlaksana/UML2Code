import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

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
  width = 450,
}: GenericSelectOnlyProps<T>) {
  const isError = error && !option;

  return (
    <FormControl error={isError}>
      <InputLabel htmlFor={`${label}-select`}>{label}</InputLabel>
      <Select
        id={`${label}-select`}
        value={option}
        label={label}
        onChange={(e) => {
          setOption(e.target.value as T);
        }}
        sx={{ width }}
      >
        {options.map((opt) => {
          if (!opt) return null;
          return (
            <MenuItem key={opt as string} value={opt as string}>
              {opt as string}
            </MenuItem>
          );
        })}
      </Select>
      {isError ? <FormHelperText>Required *</FormHelperText> : null}
    </FormControl>
  );
}

export default GenericSelect;