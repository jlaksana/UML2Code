/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Autocomplete, Button, Modal, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { RelationshipType } from '../../../types';
import LongRelationshipInput from '../inputs/LongRelationshipInput';
import ShortRelationshipInput from '../inputs/ShortRelationshipInput';

const relationshipTypes: RelationshipType[] = [
  'Realization',
  'Inheritance',
  'Association',
  'Aggregation',
  'Composition',
  'Dependency',
];

const getContentByType = (
  type: RelationshipType | null,
  source: string,
  setSource: (s: string) => void,
  target: string,
  setTarget: (t: string) => void,
  label: string,
  setLabel: (l: string) => void,
  srcMultiplicity: string,
  setSrcMultiplicity: (sm: string) => void,
  tgtMultiplicity: string,
  setTgtMultiplicity: (tm: string) => void
) => {
  switch (type) {
    case 'Association':
    case 'Aggregation':
    case 'Composition':
      return (
        <LongRelationshipInput
          type={type}
          source={source}
          setSource={setSource}
          target={target}
          setTarget={setTarget}
          label={label}
          setLabel={setLabel}
          srcMultiplicity={srcMultiplicity}
          setSrcMultiplicity={setSrcMultiplicity}
          tgtMultiplicity={tgtMultiplicity}
          setTgtMultiplicity={setTgtMultiplicity}
        />
      );
    case 'Dependency':
    case 'Inheritance':
    case 'Realization':
      return (
        <ShortRelationshipInput
          type={type}
          source={source}
          setSource={setSource}
          target={target}
          setTarget={setTarget}
        />
      );
    default:
      return null;
  }
};

type RelationshipModalProps = {
  open: boolean;
  handleClose: () => void;
};

function RelationshipModal({ open, handleClose }: RelationshipModalProps) {
  const [type, setType] = useState<RelationshipType | null>(null);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');
  const [srcMultiplicity, setSrcMultiplicity] = useState('');
  const [tgtMultiplicity, setTgtMultiplicity] = useState('');
  const [errorMessage, setErrorMessage] = useState();

  const close = () => {
    setType(null);
    setSource('');
    setTarget('');
    setErrorMessage(undefined);
    handleClose();
  };

  const handleTypeChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: RelationshipType | null
  ) => {
    setType(value);
    setSource('');
    setTarget('');
    setLabel('');
    setSrcMultiplicity('');
    setTgtMultiplicity('');
    setErrorMessage(undefined);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(source, target);
  };

  const relationshipHelperText = `Relationships are the connections between classes. 
    They contain a type, source, and target. The source and target are the classes that are connected by the relationship.`;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Relationship Form"
      aria-describedby="Specify the contents of a relationship"
    >
      <form
        className="modal-content relationship-content"
        onSubmit={handleSubmit}
      >
        <div>
          <h2>
            Create Relationship&nbsp;
            <Tooltip title={relationshipHelperText}>
              <HelpOutlineIcon fontSize="small" />
            </Tooltip>
          </h2>
          <Autocomplete
            autoComplete
            autoSelect
            options={relationshipTypes}
            value={type}
            onChange={handleTypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                variant="standard"
                required
                error={errorMessage}
                helperText={errorMessage}
              />
            )}
          />
          {getContentByType(
            type,
            source,
            setSource,
            target,
            setTarget,
            label,
            setLabel,
            srcMultiplicity,
            setSrcMultiplicity,
            tgtMultiplicity,
            setTgtMultiplicity
          )}
        </div>
        <div className="buttons">
          <Button variant="text" onClick={close}>
            Cancel
          </Button>
          <Button variant="text" type="submit">
            OK
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default RelationshipModal;
