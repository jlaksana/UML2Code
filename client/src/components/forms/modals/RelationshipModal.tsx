/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Autocomplete, Button, Modal, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { RelationshipType } from '../../../types';
import LongRelationshipInput from '../inputs/LongRelationshipInput';
import ShortRelationshipInput from '../inputs/ShortRelationshipInput';

const relationshipTypes: RelationshipType[] = [
  'Association',
  'Aggregation',
  'Composition',
  'Dependency',
  'Inheritance',
  'Realization',
];

const getContentByType = (
  type: RelationshipType | null,
  source: string,
  setSource: (s: string) => void,
  target: string,
  setTarget: (t: string) => void,
  srcInfo: { label: string; multiplicity: string },
  setSrcInfo: (s: { label: string; multiplicity: string }) => void,
  tgtInfo: { label: string; multiplicity: string },
  setTgtInfo: (s: { label: string; multiplicity: string }) => void
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
          srcInfo={srcInfo}
          setSrcInfo={setSrcInfo}
          tgtInfo={tgtInfo}
          setTgtInfo={setTgtInfo}
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

const initInfo = { label: '', multiplicity: '' };

function RelationshipModal({ open, handleClose }: RelationshipModalProps) {
  const [type, setType] = useState<RelationshipType | null>(null);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [srcInfo, setSrcInfo] = useState(initInfo);
  const [tgtInfo, setTgtInfo] = useState(initInfo);
  const [errorMessage, setErrorMessage] = useState();

  const close = () => {
    setType(null);
    setSource('');
    setTarget('');
    setSrcInfo(initInfo);
    setTgtInfo(initInfo);
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
    setSrcInfo(initInfo);
    setTgtInfo(initInfo);
    setErrorMessage(undefined);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(source, target);
    console.log(srcInfo);
    console.log(tgtInfo);
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
            srcInfo,
            setSrcInfo,
            tgtInfo,
            setTgtInfo
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
