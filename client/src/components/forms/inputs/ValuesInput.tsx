import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Button, IconButton, TextField } from '@mui/material';
import '../../../styles/FormModals.css';
import { EnumValue } from '../../../types';

type ValueFieldProps = {
  value: EnumValue;
  updateValue: (id: number, name: string) => void;
  removeValue: (index: number) => void;
  error: boolean;
};

// Individual value field
function ValueField({
  value,
  updateValue,
  removeValue,
  error,
}: ValueFieldProps) {
  const isError = error && value.name === '';

  return (
    <div className="field-line">
      <TextField
        label="Name"
        variant="standard"
        value={value.name}
        onChange={(e) => updateValue(value.id, e.target.value)}
        error={isError}
        helperText={isError ? 'Name cannot be empty' : ''}
        fullWidth
      />
      <IconButton
        className="remove-button"
        aria-label="delete value"
        color="error"
        onClick={() => removeValue(value.id)}
      >
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
    </div>
  );
}

type ValuesInputProps = {
  values: EnumValue[];
  setValues: React.Dispatch<React.SetStateAction<EnumValue[]>>;
  error: boolean;
};

// Input for enum values
export default function ValuesInput({
  values,
  setValues,
  error,
}: ValuesInputProps) {
  const addValue = () => {
    const id = values.length === 0 ? 0 : values[values.length - 1].id + 1;
    setValues((prevValues) => [...prevValues, { id, name: '' }]);
  };

  const removeValue = (id: number) => {
    setValues((prevValues) => prevValues.filter((value) => value.id !== id));
  };

  const updateValue = (id: number, name: string) => {
    const newValues = values.map((value) =>
      value.id === id ? { ...value, name } : value
    );
    setValues(newValues);
  };

  return (
    <div className="field-list">
      {values.map((value) => (
        <ValueField
          key={value.id}
          value={value}
          updateValue={updateValue}
          removeValue={removeValue}
          error={error}
        />
      ))}
      <Button variant="text" startIcon={<AddRoundedIcon />} onClick={addValue}>
        Add
      </Button>
    </div>
  );
}
