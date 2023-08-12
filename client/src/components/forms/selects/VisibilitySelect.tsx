import { MenuItem, TextField } from '@mui/material';
import { Visibility } from '../../../types';

const visibilities: Visibility[] = ['+', '—', '#'];

type VisibilitySelectProps = {
  option: Visibility;
  setOption: (option: Visibility) => void;
};

function VisibilitySelect({ option, setOption }: VisibilitySelectProps) {
  return (
    <TextField
      id="visibility-select"
      variant="standard"
      select
      required
      label="Visibility"
      value={option}
      onChange={(e) => {
        setOption(e.target.value as Visibility);
      }}
      sx={{ width: 48 }}
    >
      {visibilities.map((opt) => {
        return (
          <MenuItem key={opt as string} value={opt as string}>
            {opt as string}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export default VisibilitySelect;
