import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/FormModals.css';
import { Enum, EnumValue } from '../../../types';
import ValuesInput from '../inputs/ValuesInput';

type EnumModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing enum
  id?: string;
  data?: Enum;
};

const removeWhiteSpace = (str: string) => {
  return str.replace(/\s/g, '');
};

const enumHelperText = `Enums are a set of constants. Use them to define a set of values that can be used in your program. 
You cannot assign literal values each constant in this application.`;

function EnumModal({ open, handleClose, id, data }: EnumModalProps) {
  const [name, setName] = useState(data?.name || '');
  const [values, setValues] = useState<EnumValue[]>(data?.values || []);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No fields can be empty');

  const entitiesDispatch = useEntitiesDispatch();

  const { diagramId } = useParams();

  const close = () => {
    // reset all fields
    // dont reset if editing
    if (!id) {
      setName('');
      setValues([]);
    }
    setError(false);
    handleClose();
  };

  const handleSubmit = async () => {
    setError(false);
    let isError = false;
    if (!name) {
      setError(true);
      return;
    }
    // check if every value field is filled
    const verifiedValues = values.map((value) => {
      if (!value.name) {
        isError = true;
      }
      return {
        id: value.id,
        name: removeWhiteSpace(value.name),
      };
    });

    if (isError) {
      setError(true);
      setErrorMessage('No fields can be empty');
    } else {
      const enumer = {
        name: removeWhiteSpace(name),
        values: verifiedValues,
      };
      console.log(enumer);
      if (id) {
        // editing
        close();
      } else {
        // creating
        // axios call
        // entitiesDispatch({ type: 'ADD_ENUM', payload: enum });
        close();
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
      <div className="modal-content">
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
              <ValuesInput
                values={values}
                setValues={setValues}
                error={error}
              />
            </TabPanel>
          </TabContext>
        </div>
        <div className="buttons">
          <Button variant="text" onClick={close}>
            Cancel
          </Button>
          <Button variant="text" onClick={handleSubmit}>
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EnumModal;