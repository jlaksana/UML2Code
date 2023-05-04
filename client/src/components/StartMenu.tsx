import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/UML2.png';
import '../styles/StartMenu.css';

function StartMenu() {
  const id = useRef<HTMLInputElement>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ! This is a hack to make the loading button work. Remove later
  const sleep = (ms: number) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms));

  // Handles entering an existing diagram ID
  const handleGo = async () => {
    const idRegex = /^\d{4}$/;
    setLoading(true);
    setError(false);
    if (id.current?.value && idRegex.test(id.current.value)) {
      await sleep(1000);
      // call api to check if diagram exists
      // console.log(id);
      // redirect to editor
      navigate(`/${id.current.value}`);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    // call api to create new diagram
    // redirect to editor
    navigate(`/1234`);
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <TextField
        inputRef={id}
        label="Diagram ID"
        variant="outlined"
        fullWidth
        error={error}
        helperText={error ? 'Invalid ID' : ''}
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
