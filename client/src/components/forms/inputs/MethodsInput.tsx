import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
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
  error: boolean;
};

// Individual method field
function MethodField({
  method,
  updateMethod,
  removeMethod,
  error,
}: MethodFieldProps) {
  const isError = error && (method.name === '' || method.returnType === '');

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
          error={isError}
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
          error={isError}
          helperText={isError ? 'Name cannot be empty' : ''}
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
          error={error}
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
      <IconButton
        className="remove-button"
        aria-label="delete method"
        color="error"
        onClick={() => removeMethod(method.id)}
        sx={{ alignSelf: 'center' }}
      >
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
    </div>
  );
}

type MethodsInputProps = {
  methods: Method[];
  setMethods: React.Dispatch<React.SetStateAction<Method[]>>;
  error: boolean;
};

// Methods input field
function MethodsInput({ methods, setMethods, error }: MethodsInputProps) {
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
        const { id } = method;
        return (
          <MethodField
            method={method}
            key={id}
            updateMethod={updateMethod}
            removeMethod={removeMethod}
            error={error}
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
