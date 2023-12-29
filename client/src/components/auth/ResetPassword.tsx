import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logo from '../../assets/UML2.png';

function ResetPassword() {
  const password = useRef<HTMLInputElement>();
  const password2 = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleReset = async (event: React.FormEvent) => {
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
      await axios.put('/api/auth/reset-password', {
        token: searchParams.get('token'),
        password: password.current?.value,
      });
      setLoading(false);
      setSuccess(true);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <Typography variant="h5">Reset password</Typography>
      <form className="start-form" onSubmit={handleReset}>
        <TextField
          inputRef={password}
          label="Password"
          variant="standard"
          type="password"
          fullWidth
          required
          error={error}
          helperText={error ? errorMessage : ''}
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
          Reset
        </LoadingButton>
      </form>
      <Link to="/login">Back to login</Link>
      {success && (
        <Typography variant="subtitle1">
          Password reset successfully.
        </Typography>
      )}
    </div>
  );
}

export default ResetPassword;
