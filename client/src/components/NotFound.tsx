import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div id="not-found">
      <h1>404 Not Found</h1>
      <Button variant="text" fullWidth onClick={() => navigate('/')}>
        Go back
      </Button>
    </div>
  );
}

export default NotFound;
