import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { Method, Visibility } from '../../../types';
import GroupSelect from '../selects/GroupSelect';
import VisibilitySelect from '../selects/VisibilitySelect';

type MethodFieldProps = {
  method: Method;
  updateMethod: (
    id: number,
    name: string,
    returnType: string,
    visibility: Visibility,
    isStatic: boolean
  ) => void;
  removeMethod: (index: number) => void;
};

// Individual method field
function MethodField({ method, updateMethod, removeMethod }: MethodFieldProps) {
  return (
    <div className="field-line">
      <div className="wrap">
        <VisibilitySelect
          option={method.visibility}
          setOption={(newVisibility) =>
            updateMethod(
              method.id,
              method.name,
              method.returnType,
              newVisibility,
              method.isStatic
            )
          }
        />
        <TextField
          label="Name"
          variant="standard"
          value={method.name}
          onChange={(e) =>
            updateMethod(
              method.id,
              e.target.value,
              method.returnType,
              method.visibility,
              method.isStatic
            )
          }
          required
          sx={{ width: 270 }}
        />
        <GroupSelect
          label="Returns"
          option={method.returnType}
          setOption={(newType) =>
            updateMethod(
              method.id,
              method.name,
              newType,
              method.visibility,
              method.isStatic
            )
          }
          width={150}
          includePrimitives
          includeClasses
          includeInterfaces
          includeEnums
        />
        <FormControlLabel
          label="Static"
          control={
            <Checkbox
              checked={method.isStatic}
              onChange={(e) =>
                updateMethod(
                  method.id,
                  method.name,
                  method.returnType,
                  method.visibility,
                  e.target.checked
                )
              }
            />
          }
        />
      </div>
      <Tooltip title="Delete" placement="right">
        <IconButton
          className="remove-button"
          aria-label="delete method"
          color="error"
          onClick={() => removeMethod(method.id)}
          sx={{ alignSelf: 'center' }}
        >
          <RemoveCircleOutlineRoundedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

type MethodsInputProps = {
  methods: Method[];
  setMethods: React.Dispatch<React.SetStateAction<Method[]>>;
};

// Methods input field
function MethodsInput({ methods, setMethods }: MethodsInputProps) {
  const addMethod = () => {
    const newId = methods.length === 0 ? 0 : methods[methods.length - 1].id + 1;

    const newMethod: Method = {
      id: newId,
      name: '',
      returnType: '',
      visibility: '+',
      isStatic: false,
    };
    setMethods([...methods, newMethod]);
  };

  const removeMethod = (id: number) => {
    const newMethods = methods.filter((method) => method.id !== id);
    setMethods(newMethods);
  };

  const updateMethod = (
    id: number,
    name: string,
    returnType: string,
    visibility: Visibility,
    isStatic: boolean
  ) => {
    const newMethods = methods.map((method) => {
      if (method.id === id) {
        return {
          id,
          name,
          returnType,
          visibility,
          isStatic,
        };
      }
      return method;
    });
    setMethods(newMethods);
  };

  return (
    <div className="field-list">
      {methods.map((method) => {
        return (
          <MethodField
            method={method}
            key={method.id}
            updateMethod={updateMethod}
            removeMethod={removeMethod}
          />
        );
      })}
      <Button variant="text" startIcon={<AddRoundedIcon />} onClick={addMethod}>
        Add
      </Button>
    </div>
  );
}

export default MethodsInput;
