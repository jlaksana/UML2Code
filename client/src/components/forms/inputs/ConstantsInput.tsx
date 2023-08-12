import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import '../../../styles/FormModals.css';
import { Constant } from '../../../types';
import TypeSelect from '../selects/TypeSelect';

type ConstantFieldProps = {
  constant: Constant;
  updateConstant: (id: number, name: string, type: string) => void;
  removeConstant: (index: number) => void;
};

// Individual constant field
function ConstantField({
  constant,
  updateConstant,
  removeConstant,
}: ConstantFieldProps) {
  return (
    <div className="field-line">
      <TypeSelect
        option={constant.type}
        setOption={(newType) =>
          updateConstant(constant.id, constant.name, newType)
        }
      />
      <TextField
        label="Name"
        variant="standard"
        value={constant.name}
        onChange={(e) =>
          updateConstant(constant.id, e.target.value, constant.type)
        }
        required
        sx={{ width: 245 }}
      />
      <Tooltip title="Delete" placement="right">
        <IconButton
          className="remove-button"
          aria-label="delete constant"
          color="error"
          onClick={() => removeConstant(constant.id)}
        >
          <RemoveCircleOutlineRoundedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

type ConstantsInputProps = {
  constants: Constant[];
  setConstants: React.Dispatch<React.SetStateAction<Constant[]>>;
};

// List of constant fields
function ConstantsInput({ constants, setConstants }: ConstantsInputProps) {
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

  const updateConstant = (id: number, name: string, type: string) => {
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
        return (
          <ConstantField
            constant={constant}
            key={constant.id}
            updateConstant={updateConstant}
            removeConstant={removeConstant}
          />
        );
      })}
      <Button
        variant="text"
        startIcon={<AddRoundedIcon />}
        onClick={addConstant}
      >
        Add
      </Button>
    </div>
  );
}

export default ConstantsInput;
