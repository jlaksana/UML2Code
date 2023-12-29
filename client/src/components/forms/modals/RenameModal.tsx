import { Button, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';

type Props = {
  prevName: string | undefined;
  handleClose: (name: string | undefined) => void;
  diagramId: string;
};

function RenameModal({ prevName, handleClose, diagramId }: Props) {
  const [name, setName] = useState(prevName);

  const { setAlert } = useAlert();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/diagram/${diagramId}/rename`, { name });
      setAlert('Diagram renamed', AlertType.SUCCESS);
      handleClose(name);
    } catch (error) {
      setAlert('Error renaming diagram. Please try again.', AlertType.ERROR);
      handleClose(undefined);
    }
  };

  return (
    <Modal open={prevName !== undefined} onClose={() => handleClose(undefined)}>
      <div className="modal-content">
        <h2>Rename Diagram</h2>
        <form className="rename-modal" onSubmit={handleRename}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            defaultValue={prevName}
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttons">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleClose(undefined)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Rename
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default RenameModal;
