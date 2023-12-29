import { LoadingButton } from '@mui/lab';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/Login.css';

function Signup() {
  const [email, setEmail] = useState('');
  const username = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();
  const password2 = useRef<HTMLInputElement>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
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
      await axios.post('/api/auth/signup', {
        email,
        username: username.current?.value,
        password: password.current?.value,
      });
      setShowVerify(true);
      setLoading(false);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e.response.data.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.get(`/api/auth/resend-verification-email/${email}`);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e.response.data.message);
    }
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      {showVerify ? (
        <>
          <Typography variant="h5">
            Please verify your email. You will receive a verification email
            shortly.
          </Typography>
          <Typography variant="subtitle1">
            Didn&apos;t receive an email?
          </Typography>
          <Button variant="contained" onClick={handleResend}>
            Resend email
          </Button>
          <Link to="/login">Return to login</Link>
        </>
      ) : (
        <form className="start-form" onSubmit={handleSignup}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="standard"
            type="email"
            fullWidth
            required
            error={error}
            helperText={errorMessage}
          />
          <TextField
            inputRef={username}
            label="Username"
            variant="standard"
            fullWidth
            required
            error={error}
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
            Sign Up
          </LoadingButton>
          <Typography variant="subtitle1">
            Already have an account? Login <Link to="/login">here</Link>
          </Typography>
        </form>
      )}
      <Typography variant="overline">
        Developed by Jonathan Laksana 2023
      </Typography>
    </div>
  );
}

export default Signup;
