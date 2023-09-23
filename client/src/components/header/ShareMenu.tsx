import LinkIcon from '@mui/icons-material/Link';
import { Button, FormControlLabel, Switch, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type ShareMenuProps = {
  open: boolean;
  handleClose: () => void;
  isEditor: boolean;
};

function ShareMenu({ open, handleClose, isEditor }: ShareMenuProps) {
  const [isPublic, setIsPublic] = useState(false);

  const { diagramId } = useParams();

  useEffect(() => {
    const getPrivacy = async () => {
      try {
        const result = await axios.get('/api/diagram/privacy');
        setIsPublic(result.data.isPublic);
      } catch (error) {
        setIsPublic(false);
      }
    };
    if (open) getPrivacy();
  }, [open]);

  const handleSwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await axios.put('/api/diagram/privacy', { isPublic: event.target.checked });
    setIsPublic((prev) => !prev);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${diagramId}/view`
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-content">
        <h2>Share this Diagram</h2>
        <div className="share-menu">
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={handleSwitch}
                  disabled={!isEditor}
                />
              }
              label="Public"
            />
            {isEditor ? (
              <Typography variant="body2">
                Making a diagram public lets any user be able to view this
                diagram. It does not allow public editing.
              </Typography>
            ) : (
              <Typography variant="body2">
                This diagram is able to be viewed publicly. Copy the link below
              </Typography>
            )}
            {isPublic && (
              <Button
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={handleCopy}
                sx={{ marginTop: '1rem' }}
              >
                Copy link
              </Button>
            )}
          </div>
          <Button
            variant="contained"
            sx={{ marginTop: '1rem', float: 'right' }}
            onClick={handleClose}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ShareMenu;
