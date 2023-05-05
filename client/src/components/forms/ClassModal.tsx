import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Tab,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import '../../styles/FormModals.css';
import { Constant, Klass } from '../../types';
import ConstantsInput from './ConstantsInput';

type ClassModalProps = {
  open: boolean;
  handleClose: () => void;
};

function ClassModal({ open, handleClose }: ClassModalProps) {
  const [tabValue, setTabValue] = useState('1');
  const [name, setName] = useState('');
  const [isAbstract, setIsAbstract] = useState(false);
  const [constants, setConstants] = useState<Constant[]>([]);
  const [error, setError] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const clearFields = () => {
    setError(false);
    setTabValue('1');
    setName('');
    setIsAbstract(false);
    setConstants([]);
  };

  const removeWhiteSpace = (str: string) => {
    return str.replace(/\s/g, '');
  };

  const handleSubmit = () => {
    let isError = false;
    // validate all fields have no white space or empty
    const validatedConstants: Constant[] = constants.map((constant) => {
      const constName = removeWhiteSpace(constant.name);
      if (constName === '' || constant.type === '') {
        isError = true;
      }
      return {
        id: constant.id,
        name: constName,
        type: constant.type,
      };
    });

    if (isError === false) {
      const klass: Klass = {
        name: removeWhiteSpace(name),
        isAbstract,
        constants: validatedConstants,
      };
      console.log(klass);
      handleClose();
      clearFields();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        clearFields();
        handleClose();
      }}
      aria-labelledby="Class Form"
      aria-describedby="Specify the contents of a class"
    >
      <div className="modal-content">
        <div>
          <h2>Create Class</h2>
          <TextField
            variant="outlined"
            label="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={error}
            helperText={error ? 'No field can be empty' : ''}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAbstract}
                onChange={(e) => setIsAbstract(e.target.checked)}
                sx={{ paddingLeft: 2.5 }}
              />
            }
            label="Abstract"
          />
          <TabContext value={tabValue}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 2 }}
            >
              <TabList
                onChange={handleChange}
                aria-label="add properties to class"
              >
                <Tab label="Constants" value="1" />
                <Tab label="Attributes" value="2" />
                <Tab label="Methods" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, paddingTop: '1em' }}>
              <ConstantsInput
                constants={constants}
                setConstants={setConstants}
                error={error}
              />
            </TabPanel>
            <TabPanel value="2">Attributes Section</TabPanel>
            <TabPanel value="3">Methods Section</TabPanel>
          </TabContext>
        </div>
        <div className="buttons">
          <Button
            variant="text"
            onClick={() => {
              clearFields();
              handleClose();
            }}
          >
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

export default ClassModal;
