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
import { Attribute, Constant, Klass, Method } from '../../types';
import AttributesInput from './inputs/AttributesInput';
import ConstantsInput from './inputs/ConstantsInput';
import MethodsInput from './inputs/MethodsInput';

type ClassModalProps = {
  open: boolean;
  handleClose: () => void;
};

function ClassModal({ open, handleClose }: ClassModalProps) {
  const [tabValue, setTabValue] = useState('1');
  const [name, setName] = useState('');
  const [isAbstract, setIsAbstract] = useState(false);
  const [constants, setConstants] = useState<Constant[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [error, setError] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const clearFields = () => {
    setError(false);
    setTabValue('1');
    setName('');
    setIsAbstract(false);
    setConstants([]);
    setAttributes([]);
    setMethods([]);
  };

  const removeWhiteSpace = (str: string) => {
    return str.replace(/\s/g, '');
  };

  const handleSubmit = () => {
    const klass: Klass = {
      name: removeWhiteSpace(name),
      isAbstract,
      constants,
      attributes,
      methods,
    };
    try {
      // fetch()
      console.log(klass);
      handleClose();
      clearFields();
    } catch (err) {
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
            variant="standard"
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
                sx={{ paddingLeft: 2 }}
              />
            }
            label="Abstract"
          />
          <TabContext value={tabValue}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 2.5 }}
            >
              <TabList
                onChange={handleTabChange}
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
            <TabPanel value="2" sx={{ padding: 0, paddingTop: '1em' }}>
              <AttributesInput
                attributes={attributes}
                setAttributes={setAttributes}
                error={error}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: 0, paddingTop: '1em' }}>
              <MethodsInput
                methods={methods}
                setMethods={setMethods}
                error={error}
              />
            </TabPanel>
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
