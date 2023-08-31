import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/FormModals.css';
import { Entity, Enum, EnumValue } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import ValuesInput from '../inputs/ValuesInput';
import { removeWhiteSpace } from './utils';

type EnumModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing enum
  id?: string;
  data?: Enum;
};

const enumHelperText = `Enums are a set of constants. Use them to define a set of values that can be used in your program. 
You cannot assign literal values each constant in this application.`;

function EnumModal({ open, handleClose, id, data }: EnumModalProps) {
  const [name, setName] = useState(data?.name || '');
  const [values, setValues] = useState<EnumValue[]>(data?.values || []);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No fields can be empty');

  const entitiesDispatch = useEntitiesDispatch();
  const { setAlert } = useAlert();

  const { diagramId } = useParams();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setValues(data.values || []);
    }
  }, [data]);

  const close = () => {
    // reset all fields
    // dont reset if editing
    if (!id || !data) {
      setName('');
      setValues([]);
    } else {
      setName(data.name);
      setValues(data.values || []);
    }
    setError(false);
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const enumer = {
      name: removeWhiteSpace(name),
      values: values.map((v) => ({ ...v, name: removeWhiteSpace(v.name) })),
    };
    if (id) {
      // editing
      try {
        const res = await axios.put(`/api/enum/${id}`, enumer, {
          params: { diagramId },
        });
        const updatedEnum = (await res.data) as Entity<Enum>;
        entitiesDispatch({ type: 'UPDATE_ENUM', payload: updatedEnum });
        setAlert('Enum updated successfully', AlertType.SUCCESS);
        close();
      } catch (err: any) {
        setError(true);
        setErrorMessage(err.response.data.message);
      }
    } else {
      // creating
      try {
        const res = await axios.post('/api/enum', enumer, {
          params: { diagramId },
        });
        const newEnum = (await res.data) as Entity<Enum>;
        entitiesDispatch({ type: 'ADD_ENUM', payload: newEnum });
        setAlert('Enum created successfully', AlertType.SUCCESS);
        close();
      } catch (err: any) {
        setError(true);
        setErrorMessage(err.response.data.message);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Enum Form"
      aria-describedby="Specify the contents of a enum"
    >
      <form className="modal-content entity-content" onSubmit={handleSubmit}>
        <div>
          <h2>
            {id ? 'Edit' : 'Create'} Enumeration&nbsp;
            <Tooltip title={enumHelperText}>
              <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
          </h2>
          <TextField
            variant="standard"
            label="Enum Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={error}
            helperText={error ? errorMessage : ''}
          />
          <TabContext value="1">
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 2.5 }}
            >
              <TabList aria-label="add properties to enum">
                <Tab label="Values" value="1" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, paddingTop: '1em' }}>
              <ValuesInput values={values} setValues={setValues} />
            </TabPanel>
          </TabContext>
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

export default EnumModal;
