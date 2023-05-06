import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Button, IconButton, TextField } from '@mui/material';
import '../../../styles/FormModals.css';
import { Constant, DataType } from '../../../types';
import TypeSelect from '../selects/TypeSelect';

type ConstantFieldProps = {
  constant: Constant;
  updateConstant: (id: number, name: string, type: DataType) => void;
  removeConstant: (index: number) => void;
  error: boolean;
};

// Individual constant field
function ConstantField({
  constant,
  updateConstant,
  removeConstant,
  error,
}: ConstantFieldProps) {
  const isError = error && (constant.name === '' || constant.type === '');

  return (
    <div className="field-line">
      <TypeSelect
        option={constant.type}
        setOption={(newType) =>
          updateConstant(constant.id, constant.name, newType)
        }
        error={isError}
      />
      <TextField
        label="Name"
        variant="standard"
        value={constant.name}
        onChange={(e) =>
          updateConstant(constant.id, e.target.value, constant.type)
        }
        error={isError}
        helperText={isError ? 'Name cannot be empty' : ''}
        sx={{ width: 220 }}
      />
      <IconButton
        className="remove-button"
        aria-label="delete constant"
        color="error"
        onClick={() => removeConstant(constant.id)}
      >
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
    </div>
  );
}

type ConstantsInputProps = {
  constants: Constant[];
  setConstants: React.Dispatch<React.SetStateAction<Constant[]>>;
  error: boolean;
};

// List of constant fields
function ConstantsInput({
  constants,
  setConstants,
  error,
}: ConstantsInputProps) {
  const addConstant = () => {
    const newId =
      constants.length === 0 ? 0 : constants[constants.length - 1].id + 1;

    const newConstant: Constant = {
      id: newId,
      name: '',
      type: '',
    };
    setConstants([...constants, newConstant]);
  };

  const removeConstant = (id: number) => {
    const newConstants = constants.filter((constant) => constant.id !== id);
    setConstants(newConstants);
  };

  const updateConstant = (id: number, name: string, type: DataType) => {
    const newConstants = constants.map((constant) => {
      if (constant.id === id) {
        return {
          id,
          name,
          type,
        };
      }
      return constant;
    });
    setConstants(newConstants);
  };

  return (
    <div className="field-list">
      {constants.map((constant) => {
        const { id } = constant;
        return (
          <ConstantField
            constant={constant}
            key={id}
            updateConstant={updateConstant}
            removeConstant={removeConstant}
            error={error}
          />
        );
      })}
      <Button
        variant="text"
        startIcon={<AddRoundedIcon />}
        onClick={() => addConstant()}
      >
        Add
      </Button>
    </div>
  );
}

export default ConstantsInput;
