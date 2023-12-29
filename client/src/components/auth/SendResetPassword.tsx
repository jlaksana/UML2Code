import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/UML2.png';

function SendResetPassword() {
  const email = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await axios.get(
        `/api/auth/send-reset-password-email/${email.current?.value}`
      );
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
      <Typography variant="h5">Send reset password email</Typography>
      <form className="start-form" onSubmit={handleSend}>
        <TextField
          inputRef={email}
          label="Email"
          variant="standard"
          type="email"
          fullWidth
          required
          error={error}
          helperText={error ? errorMessage : ''}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={loading}
          loadingIndicator="Loading…"
        >
          Send
        </LoadingButton>
      </form>
      <Link to="/login">Back to login</Link>
      {success && (
        <Typography variant="subtitle1">
          Email sent. Please check your inbox.
        </Typography>
      )}
    </div>
  );
}

export default SendResetPassword;
