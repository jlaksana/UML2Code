import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/StartMenu.css';

function StartMenu() {
  const id = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handles entering an existing diagram ID
  const handleGo = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    if (id.current?.value) {
      // call api to get diagram
      try {
        await axios
          .post(
            `/api/diagram/${id.current.value}/login`,
            { password: password.current?.value },
            {
              withCredentials: false,
            }
          )
          .then(() => {
            navigate(`/${id.current?.value}/edit`);
          })
          .catch((err) => {
            setError(true);
            setErrorMessage(err.response.data.message);
          });
      } catch (err) {
        setError(true);
        setErrorMessage('Server is not responding');
      }
    } else {
      setError(true);
      setErrorMessage('Please enter a diagram ID');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    navigate('/create');
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <form className="start-form" onSubmit={handleGo}>
        <TextField
          inputRef={id}
          label="Diagram ID"
          variant="standard"
          fullWidth
          required
          error={error}
          helperText={error ? errorMessage : ''}
        />
        <TextField
          inputRef={password}
          label="Password"
          variant="standard"
          type="password"
          fullWidth
          required
          error={error}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={loading}
          loadingIndicator="Loading…"
        >
          Go
        </LoadingButton>
      </form>
      <span>-- or --</span>
      <LoadingButton
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        loadingIndicator="Loading…"
        onClick={handleCreate}
      >
        Create New
      </LoadingButton>
    </div>
  );
}

export default StartMenu;
