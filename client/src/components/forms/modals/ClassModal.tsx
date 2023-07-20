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
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/FormModals.css';
import { Attribute, Constant, Entity, Klass, Method } from '../../../types';
import AttributesInput from '../inputs/AttributesInput';
import ConstantsInput from '../inputs/ConstantsInput';
import MethodsInput from '../inputs/MethodsInput';

type ClassModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing class
  id?: string;
  data?: Klass;
};

const removeWhiteSpace = (str: string) => {
  return str.replace(/\s/g, '');
};

const classHelperText = `Classes are the building blocks of your program. 
  They contain a name and could have constants, attributes, and methods. If abstract, check the Abstract box.\n
  Notes: Constants are always static, attributes are recommended as private, and you cannot specify parameters for methods.`;

function ClassModal({ open, handleClose, id, data }: ClassModalProps) {
  const [tabValue, setTabValue] = useState('1');
  const [name, setName] = useState(data?.name || '');
  const [isAbstract, setIsAbstract] = useState(data?.isAbstract || false);
  const [constants, setConstants] = useState<Constant[]>(data?.constants || []);
  const [attributes, setAttributes] = useState<Attribute[]>(
    data?.attributes || []
  );
  const [methods, setMethods] = useState<Method[]>(data?.methods || []);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No fields can be empty');

  const entitiesDispatch = useEntitiesDispatch();

  const { diagramId } = useParams();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const close = () => {
    // reset all fields
    // dont reset if editing
    if (!id) {
      setTabValue('1');
      setName('');
      setIsAbstract(false);
      setConstants([]);
      setAttributes([]);
      setMethods([]);
    }
    setError(false);
    handleClose();
  };

  const handleSubmit = async () => {
    setError(false);

    const klass: Klass = {
      name: removeWhiteSpace(name),
      isAbstract,
      constants: constants.map((constant) => ({
        ...constant,
        name: removeWhiteSpace(constant.name),
      })),
      attributes: attributes.map((attribute) => ({
        ...attribute,
        name: removeWhiteSpace(attribute.name),
      })),
      methods: methods.map((method) => ({
        ...method,
        name: removeWhiteSpace(method.name),
      })),
    };
    if (id) {
      // editing existing class
      // TODO payload should be an entity after calling api
      // entitiesDispatch({ type: 'UPDATE_KLASS', payload: klass, id });
      close();
    } else {
      // adding new class
      await axios
        .post(`/api/class?diagramId=${diagramId}`, klass, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          timeout: 5000,
        })
        .then((res) => {
          const newKlass = res.data as Entity<Klass>;
          entitiesDispatch({ type: 'ADD_KLASS', payload: newKlass });
          close();
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.response.data.message);
        });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Class Form"
      aria-describedby="Specify the contents of a class"
    >
      <form className="modal-content" onSubmit={handleSubmit}>
        <div>
          <h2>
            {id ? 'Edit' : 'Create'} Class&nbsp;
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
            required
            error={error}
            helperText={error ? errorMessage : ''}
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
              />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0, paddingTop: '1em' }}>
              <AttributesInput
                attributes={attributes}
                setAttributes={setAttributes}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: 0, paddingTop: '1em' }}>
              <MethodsInput methods={methods} setMethods={setMethods} />
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

export default ClassModal;
