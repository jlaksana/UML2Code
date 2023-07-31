import { Alert } from '@mui/material';
import useAlert from './useAlert';

function AlertToast() {
  const { text, type } = useAlert();

  if (text && type) {
    return (
      <Alert
        severity={type}
        variant="filled"
        sx={{
          position: 'fixed',
          top: '5em',
          zIndex: 10,
        }}
      >
        {text}
      </Alert>
    );
  }
  return null;
}

export default AlertToast;
