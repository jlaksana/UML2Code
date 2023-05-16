import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Tab,
  TextField,
  Tooltip,
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

  const close = () => {
    setError(false);
    setTabValue('1');
    setName('');
    setIsAbstract(false);
    setConstants([]);
    setAttributes([]);
    setMethods([]);
    handleClose();
  };

  const removeWhiteSpace = (str: string) => {
    return str.replace(/\s/g, '');
  };

  const handleSubmit = () => {
    setError(false);
    let isError = false;
    if (!name) {
      setError(true);
      return;
    }
    // check if every constant field is filled out. error if not
    const verifiedConstants = constants.map((constant) => {
      if (!constant.name || !constant.type) {
        isError = true;
      }
      return {
        id: constant.id,
        name: removeWhiteSpace(constant.name),
        type: constant.type,
      };
    });

    // check if every attribute field is filled out. error if not
    const verifiedAttributes = attributes.map((attribute) => {
      if (!attribute.name || !attribute.type || !attribute.visibility) {
        isError = true;
      }
      return {
        id: attribute.id,
        name: removeWhiteSpace(attribute.name),
        type: attribute.type,
        visibility: attribute.visibility,
      };
    });

    // check if every method field is filled out. error if not
    const verifiedMethods = methods.map((method) => {
      if (!method.name || !method.returnType || !method.visibility) {
        isError = true;
      }
      return {
        id: method.id,
        name: removeWhiteSpace(method.name),
        returnType: method.returnType,
        visibility: method.visibility,
        isStatic: method.isStatic,
      };
    });

    const klass: Klass = {
      name: removeWhiteSpace(name),
      isAbstract,
      constants: verifiedConstants,
      attributes: verifiedAttributes,
      methods: verifiedMethods,
    };
    if (!isError) {
      // fetch()
      console.log(klass);
      close();
    } else {
      setError(true);
    }
  };

  const classHelperText = `Classes are the building blocks of your program. 
  They contain a name and could have constants, attributes, and methods. If abstract, check the Abstract box.\n
  Notes: Constants are always static, attributes are recommended as private, and you cannot specify parameters for methods.`;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Class Form"
      aria-describedby="Specify the contents of a class"
    >
      <div className="modal-content">
        <div>
          <h2>
            Create Class&nbsp;
            <Tooltip title={classHelperText}>
              <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
          </h2>
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

export default ClassModal;
