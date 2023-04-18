import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import { useState } from 'react';
import logo from '../assets/UML2.png';
import '../styles/StartMenu.css';

function StartMenu() {
  const [id, setId] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ! This is a hack to make the loading button work. Remove later
  const sleep = (ms: number) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms));

  // Handles entering an existing diagram ID
  const handleGo = async () => {
    const idRegex = /^\d{4}$/;
    setLoading(true);
    setError(false);
    if (idRegex.test(id)) {
      await sleep(1000);
      // call api to check if diagram exists
      // console.log(id);
      // redirect to editor
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    // call api to create new diagram
    // redirect to editor
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <TextField
        id="diagram-id"
        label="Diagram ID"
        variant="outlined"
        fullWidth
        error={error}
        helperText={error ? 'Invalid ID' : ''}
        value={id}
        onChange={(e) => setId(e.target.value)}
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
