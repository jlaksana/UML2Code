import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Button, IconButton, TextField } from '@mui/material';
import '../../../styles/FormModals.css';
import { Attribute, DataType, Visibility } from '../../../types';
import TypeSelect from '../selects/TypeSelect';
import VisibilitySelect from '../selects/VisibilitySelect';

type AttributeFieldProps = {
  attribute: Attribute;
  updateAttribute: (
    id: number,
    name: string,
    type: DataType,
    visibility: Visibility
  ) => void;
  removeAttribute: (index: number) => void;
  error: boolean;
};

// Individual attribute field
function AttributeField({
  attribute,
  updateAttribute,
  removeAttribute,
  error,
}: AttributeFieldProps) {
  const isError = error && (attribute.name === '' || attribute.type === '');

  return (
    <div className="field-line">
      <VisibilitySelect
        option={attribute.visibility}
        setOption={(newVisibility) =>
          updateAttribute(
            attribute.id,
            attribute.name,
            attribute.type,
            newVisibility
          )
        }
        error={isError}
      />
      <TypeSelect
        option={attribute.type}
        setOption={(newType) =>
          updateAttribute(
            attribute.id,
            attribute.name,
            newType,
            attribute.visibility
          )
        }
        error={isError}
      />
      <TextField
        label="Name"
        variant="standard"
        value={attribute.name}
        onChange={(e) =>
          updateAttribute(
            attribute.id,
            e.target.value,
            attribute.type,
            attribute.visibility
          )
        }
        error={isError}
        helperText={isError ? 'Name cannot be empty' : ''}
        sx={{ width: 150 }}
      />
      <IconButton
        className="remove-button"
        aria-label="delete attribute"
        color="error"
        onClick={() => removeAttribute(attribute.id)}
      >
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
    </div>
  );
}

type AttributesInputProps = {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  error: boolean;
};

// List of attributes
function AttributesInput({
  attributes,
  setAttributes,
  error,
}: AttributesInputProps) {
  const addAttribute = () => {
    const newId =
      attributes.length === 0 ? 0 : attributes[attributes.length - 1].id + 1;

    const newAttribute: Attribute = {
      id: newId,
      name: '',
      type: '',
      visibility: '—',
    };
    setAttributes([...attributes, newAttribute]);
  };

  const removeAttribute = (id: number) => {
    const newAttributes = attributes.filter((attribute) => attribute.id !== id);
    setAttributes(newAttributes);
  };

  const updateAttribute = (
    id: number,
    name: string,
    type: DataType,
    visibility: Visibility
  ) => {
    const newAttributes = attributes.map((attribute) => {
      if (attribute.id === id) {
        return {
          id,
          name,
          type,
          visibility,
        };
      }
      return attribute;
    });
    setAttributes(newAttributes);
  };

  return (
    <div className="field-list">
      {attributes.map((attribute) => {
        const { id } = attribute;
        return (
          <AttributeField
            attribute={attribute}
            key={id}
            updateAttribute={updateAttribute}
            removeAttribute={removeAttribute}
            error={error}
          />
        );
      })}
      <Button
        variant="text"
        startIcon={<AddRoundedIcon />}
        onClick={() => addAttribute()}
      >
        Add
      </Button>
    </div>
  );
}

export default AttributesInput;
