import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab } from '@mui/material';
import { useState } from 'react';
import '../../styles/FormModals.css';
import ConstantsInput from './ConstantsInput';

interface ClassModalProps {
  open: boolean;
  handleClose: () => void;
}

function ClassModal({ open, handleClose }: ClassModalProps) {
  const [tabValue, setTabValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleSubmit = () => {
    console.log('submit clicked');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Class Form"
      aria-describedby="Specify the contents of a class"
    >
      <div className="modal-content">
        <div>
          <h2>Create Class</h2>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="add properties to class"
              >
                <Tab label="Constants" value="1" />
                <Tab label="Attributes" value="2" />
                <Tab label="Methods" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ConstantsInput />
            </TabPanel>
            <TabPanel value="2">Attributes Section</TabPanel>
            <TabPanel value="3">Methods Section</TabPanel>
          </TabContext>
        </div>
        <div className="buttons">
          <Button variant="text" onClick={handleClose}>
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
