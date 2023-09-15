import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/FormModals.css';
import { Constant, Entity, Interface, Method } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import ConstantsInput from '../inputs/ConstantsInput';
import MethodsInput from '../inputs/MethodsInput';
import { removeWhiteSpace } from './utils';

type InterfaceModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing interface
  id?: string;
  data?: Interface;
};

const interfaceHelperText = `Interfaces are used to define common behavior for classes. 
They have a name and contain constants and methods. If you want to enforce attributes, create an abstract class instead.`;

function InterfaceModal({ open, handleClose, id, data }: InterfaceModalProps) {
  const [tabValue, setTabValue] = useState('1');
  const [name, setName] = useState(data?.name || '');
  const [constants, setConstants] = useState<Constant[]>(data?.constants || []);
  const [methods, setMethods] = useState<Method[]>(data?.methods || []);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('No fields can be empty');

  const entitiesDispatch = useEntitiesDispatch();
  const { setAlert } = useAlert();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setConstants(data.constants || []);
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
      setConstants([]);
      setMethods([]);
    } else {
      setName(data.name);
      setConstants(data.constants || []);
      setMethods(data.methods || []);
    }
    setTabValue('1');
    setError(false);
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const interfaceData = {
      name: removeWhiteSpace(name),
      constants: constants.map((constant) => ({
        ...constant,
        name: removeWhiteSpace(constant.name),
      })),
      methods: methods.map((method) => ({
        ...method,
        name: removeWhiteSpace(method.name),
      })),
    };
    if (id) {
      // edit
      try {
        const res = await axios.put(`/api/interface/${id}`, interfaceData);
        const updatedInterface = res.data as Entity;
        entitiesDispatch({
          type: 'UPDATE_ENTITY',
          payload: updatedInterface,
        });
        setAlert('Interface updated successfully', AlertType.SUCCESS);
        close();
      } catch (err: any) {
        setError(true);
        setErrorMessage(err.response.data.message);
      }
    } else {
      // create
      try {
        const res = await axios.post('/api/interface', interfaceData);
        const newInterface = res.data as Entity;
        entitiesDispatch({
          type: 'ADD_ENTITY',
          payload: newInterface,
        });
        setAlert('Interface created successfully', AlertType.SUCCESS);
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
      aria-labelledby="Interface Form"
      aria-describedby="Specify the contents of an interface"
    >
      <form className="modal-content entity-content" onSubmit={handleSubmit}>
        <div>
          <h2>
            {id ? 'Edit' : 'Create'} Interface&nbsp;
            <Tooltip title={interfaceHelperText}>
              <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
          </h2>
          <TextField
            variant="standard"
            label="Interface Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={error}
            helperText={error ? errorMessage : ''}
          />
          <TabContext value={tabValue}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 2.5 }}
            >
              <TabList
                onChange={handleTabChange}
                aria-label="add properties to interface"
              >
                <Tab label="Constants" value="1" />
                <Tab label="Methods" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, paddingTop: '1em' }}>
              <ConstantsInput
                constants={constants}
                setConstants={setConstants}
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

export default InterfaceModal;
