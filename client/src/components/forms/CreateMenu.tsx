import { LoadingButton } from '@mui/lab';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/StartMenu.css';

function CreateMenu() {
  const password = useRef<HTMLInputElement>();
  const password2 = useRef<HTMLInputElement>();
  const [id, setId] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    try {
      if (password.current?.value !== password2.current?.value) {
        setError(true);
        setErrorMessage('Passwords do not match');
        setLoading(false);
        return;
      }
      const result = await axios.post(
        '/api/diagram/create',
        { password: password.current?.value },
        {
          withCredentials: false,
        }
      );
      setId(result.data.id);
      setLoading(false);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e.response.data.message);
      setLoading(false);
    }
  };

  const handleGoToExisting = () => {
    navigate('/');
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      {id ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Success! Your Diagram ID is <strong>{id}</strong>
          </Typography>
        </div>
      ) : (
        <form className="start-form" onSubmit={handleCreate}>
          <TextField
            inputRef={password}
            label="Password"
            variant="standard"
            type="password"
            fullWidth
            required
            error={error}
            helperText={errorMessage}
          />
          <TextField
            inputRef={password2}
            label="Re-enter Password"
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
            Create New
          </LoadingButton>
        </form>
      )}
      {!id && <span>-- or --</span>}
      <LoadingButton
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        loadingIndicator="Loading…"
        onClick={handleGoToExisting}
      >
        {id ? 'Return' : 'Go to Existing'}
      </LoadingButton>
    </div>
  );
}

export default CreateMenu;
