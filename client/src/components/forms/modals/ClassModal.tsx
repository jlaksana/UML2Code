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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/FormModals.css';
import { Attribute, Constant, Entity, Klass, Method } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import AttributesInput from '../inputs/AttributesInput';
import ConstantsInput from '../inputs/ConstantsInput';
import MethodsInput from '../inputs/MethodsInput';
import { removeWhiteSpace } from './utils';

type ClassModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing class
  id?: string;
  data?: Klass;
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
  const { setAlert } = useAlert();

  const { diagramId } = useParams();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setIsAbstract(data.isAbstract);
      setConstants(data.constants || []);
      setAttributes(data.attributes || []);
      setMethods(data.methods || []);
    }
  }, [data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const close = () => {
    // reset all fields
    // dont reset if editing
    if (!id || !data) {
      setName('');
      setIsAbstract(false);
      setConstants([]);
      setAttributes([]);
      setMethods([]);
    } else {
      setName(data.name);
      setIsAbstract(data.isAbstract);
      setConstants(data.constants || []);
      setAttributes(data.attributes || []);
      setMethods(data.methods || []);
    }
    setTabValue('1');
    setError(false);
    handleClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      try {
        const res = await axios.put(`/api/class/${id}`, klass, {
          params: { diagramId },
        });
        const updatedKlass = res.data as Entity<Klass>;
        entitiesDispatch({ type: 'UPDATE_KLASS', payload: updatedKlass });
        setAlert('Class updated successfully', AlertType.SUCCESS);
        close();
      } catch (err: any) {
        setError(true);
        setErrorMessage(err.response.data.message);
      }
    } else {
      // adding new class
      try {
        const res = await axios.post('/api/class', klass, {
          params: { diagramId },
        });
        const newKlass = res.data as Entity<Klass>;
        entitiesDispatch({ type: 'ADD_KLASS', payload: newKlass });
        setAlert('Class created successfully', AlertType.SUCCESS);
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
      aria-labelledby="Class Form"
      aria-describedby="Specify the contents of a class"
    >
      <form className="modal-content entity-content" onSubmit={handleSubmit}>
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
