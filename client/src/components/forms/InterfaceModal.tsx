import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntitiesDispatch } from '../../context/EntitiesContext';
import '../../styles/FormModals.css';
import { Constant, Interface, Method } from '../../types';
import ConstantsInput from './inputs/ConstantsInput';
import MethodsInput from './inputs/MethodsInput';

type InterfaceModalProps = {
  open: boolean;
  handleClose: () => void;
  // defined only when editing existing interface
  id?: string;
  data?: Interface;
};

const removeWhiteSpace = (str: string) => {
  return str.replace(/\s/g, '');
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
      setConstants([]);
      setMethods([]);
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

    if (isError) {
      setError(true);
      setErrorMessage('No fields can be empty');
    } else {
      const interfaceData = {
        name: removeWhiteSpace(name),
        constants: verifiedConstants,
        methods: verifiedMethods,
      };
      if (id) {
        // edit
        // try {
        //   const res = await axios.put(`/api/interfaces/${id}`, interfaceData);
        //   const updatedInterface = res.data;
        //   entitiesDispatch({
        //     type: 'UPDATE_INTERFACE',
        //     payload: { diagramId, interfaceId: id, interfaceData: updatedInterface },
        //   });
        //   close();
        // } catch (err) {
        //   console.log(err);
        // }
      } else {
        // create
        // try {
        //   const res = await axios.post(
        //     `/api/interfaces?diagramId=${diagramId}`,
        //     interfaceData,
        //     {
        //       headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json;charset=UTF-8',
        //       },
        //       timeout: 5000,
        //     }
        //   );
        //   const newInterface = res.data as Entity<Interface>;
        //   entitiesDispatch({
        //     type: 'ADD_INTERFACE',
        //     payload: newInterface,
        //   });
        //   close();
        // } catch (err: any) {
        //   setError(true);
        //   setErrorMessage(err.response.data.message);
        // }
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
      <div className="modal-content">
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

export default InterfaceModal;
