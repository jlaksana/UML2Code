/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Autocomplete,
  Button,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRelationshipsDispatch } from '../../../context/RelationshipsContext';
import { Relationship, RelationshipType } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import LongRelationshipInput from '../inputs/LongRelationshipInput';
import ShortRelationshipInput from '../inputs/ShortRelationshipInput';

const relationshipTypes: RelationshipType[] = [
  'Implementation',
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
    case 'Implementation':
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

const relationshipHelperText = `Relationships are the connections between classes. 
        They contain a type, source, and target. The source and target are the classes that are connected by the relationship.`;

function RelationshipModal({ open, handleClose }: RelationshipModalProps) {
  const [type, setType] = useState<RelationshipType | null>(null);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');
  const [srcMultiplicity, setSrcMultiplicity] = useState('');
  const [tgtMultiplicity, setTgtMultiplicity] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const relationshipsDispatch = useRelationshipsDispatch();
  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  const close = () => {
    setType(null);
    setSource('');
    setTarget('');
    setLabel('');
    setSrcMultiplicity('');
    setTgtMultiplicity('');
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(undefined);
    setLoading(true);

    const relationship = {
      type,
      source,
      target,
      label,
      srcMultiplicity,
      tgtMultiplicity,
    };

    try {
      const res = await axios.post(
        `/api/relationship?diagramId=${diagramId}`,
        relationship
      );
      const newRelationship = res.data as Relationship;
      relationshipsDispatch({
        type: 'ADD_RELATIONSHIP',
        payload: newRelationship,
      });
      setAlert('Relationship created successfully', AlertType.SUCCESS);
      close();
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
    }
    setLoading(false);
  };

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
            autoHighlight
            options={relationshipTypes}
            value={type}
            onChange={handleTypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                variant="standard"
                required
                error={errorMessage !== undefined}
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
          <Button variant="text" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button variant="text" type="submit" disabled={loading}>
            OK
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function RelationshipEditModal({
  open,
  handleClose,
  id,
  relationshipType,
}: RelationshipModalProps & {
  id: string;
  relationshipType: RelationshipType;
}) {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');
  const [srcMultiplicity, setSrcMultiplicity] = useState('');
  const [tgtMultiplicity, setTgtMultiplicity] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const relationshipsDispatch = useRelationshipsDispatch();
  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    const getRelationship = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/relationship/${id}?diagramId=${diagramId}`
        );
        const relationship = res.data as Relationship;
        setSource(relationship.source);
        setTarget(relationship.target);
        setLabel(relationship.data?.label || '');
        setSrcMultiplicity(relationship.data?.srcMultiplicity || '');
        setTgtMultiplicity(relationship.data?.tgtMultiplicity || '');
      } catch (err: any) {
        setErrorMessage('Server Error. Please try again or report this bug.');
      }
      setLoading(false);
    };
    if (open) {
      getRelationship();
    }
  }, [diagramId, id, open]);

  const close = () => {
    setSource('');
    setTarget('');
    setLabel('');
    setSrcMultiplicity('');
    setTgtMultiplicity('');
    setErrorMessage(undefined);
    handleClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(undefined);
    setLoading(true);

    const relationship = {
      type: relationshipType,
      source,
      target,
      label,
      srcMultiplicity,
      tgtMultiplicity,
    };

    try {
      const res = await axios.put(
        `/api/relationship/${id}?diagramId=${diagramId}`,
        relationship
      );
      const updatedRelationship = res.data as Relationship;
      relationshipsDispatch({
        type: 'UPDATE_RELATIONSHIP',
        payload: updatedRelationship,
      });
      setAlert('Relationship updated successfully', AlertType.SUCCESS);
      close();
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Edit Relationship Form"
      aria-describedby="Edit the contents of a relationship"
    >
      <form
        className="modal-content relationship-content"
        onSubmit={handleSubmit}
      >
        <div>
          <h2>
            Edit Relationship&nbsp;
            <Tooltip title={relationshipHelperText}>
              <HelpOutlineIcon fontSize="small" />
            </Tooltip>
          </h2>
          {errorMessage && (
            <Typography variant="subtitle2" gutterBottom color="error">
              Error: {errorMessage}
            </Typography>
          )}
          {getContentByType(
            relationshipType,
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
          <Button variant="text" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button variant="text" type="submit" disabled={loading}>
            OK
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default RelationshipModal;
