import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/StartMenu.css';

function StartMenu() {
  const id = useRef<HTMLInputElement>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handles entering an existing diagram ID
  const handleGo = async () => {
    setLoading(true);
    setError(false);
    if (id.current?.value) {
      // call api to get diagram
      await axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/diagram/${id.current.value}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            timeout: 5000,
          }
        )
        .then(({ data }) => {
          navigate(`/${data.id}`);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.response.data.message);
        });
    } else {
      setError(true);
      setErrorMessage('Please enter a diagram ID');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    // call api to create new diagram
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/diagram`)
      .then(({ data }) => {
        // redirect to editor
        navigate(`/${data.id}`);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <TextField
        inputRef={id}
        label="Diagram ID"
        variant="standard"
        fullWidth
        error={error}
        helperText={error ? errorMessage : ''}
      />
      <LoadingButton
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        loadingIndicator="Loading…"
        onClick={handleGo}
      >
        Go
      </LoadingButton>
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
