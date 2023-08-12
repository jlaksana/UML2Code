import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import '../../../styles/FormModals.css';
import { Attribute, Visibility } from '../../../types';
import TypeSelect from '../selects/TypeSelect';
import VisibilitySelect from '../selects/VisibilitySelect';

type AttributeFieldProps = {
  attribute: Attribute;
  updateAttribute: (
    id: number,
    name: string,
    type: string,
    visibility: Visibility
  ) => void;
  removeAttribute: (index: number) => void;
};

// Individual attribute field
function AttributeField({
  attribute,
  updateAttribute,
  removeAttribute,
}: AttributeFieldProps) {
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
        required
        sx={{ width: 170 }}
      />
      <Tooltip title="Delete" placement="right">
        <IconButton
          className="remove-button"
          aria-label="delete attribute"
          color="error"
          onClick={() => removeAttribute(attribute.id)}
        >
          <RemoveCircleOutlineRoundedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

type AttributesInputProps = {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
};

// List of attributes
function AttributesInput({ attributes, setAttributes }: AttributesInputProps) {
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
    type: string,
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
        return (
          <AttributeField
            attribute={attribute}
            key={attribute.id}
            updateAttribute={updateAttribute}
            removeAttribute={removeAttribute}
          />
        );
      })}
      <Button
        variant="text"
        startIcon={<AddRoundedIcon />}
        onClick={addAttribute}
      >
        Add
      </Button>
    </div>
  );
}

export default AttributesInput;
