import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/Login.css';

function Login() {
  const email = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    if (email.current?.value) {
      // call api to get diagram
      try {
        await axios
          .post(`/api/auth/login`, {
            email: email.current?.value,
            password: password.current?.value,
          })
          .then((res) => {
            localStorage.setItem('authToken', res.data.authToken);
            navigate(`/dashboard`);
          })
          .catch((err) => {
            if (err.response.data.message === 'User not verified') {
              // eslint-disable-next-line no-param-reassign
              err.response.data.message =
                'User not verified. Please check your email for a verification link.';
              axios.get(
                `/api/auth/resend-verification-email/${email.current?.value}`
              );
            }
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

  const handleSignup = async () => {
    navigate('/signup');
  };

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <form className="start-form" onSubmit={handleLogin}>
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
          Login
        </LoadingButton>
        <Typography variant="subtitle1">
          Forgot password? Reset password{' '}
          <Link to="/send-reset-password">here</Link>
        </Typography>
      </form>
      <span>-- or --</span>
      <LoadingButton
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        loadingIndicator="Loading…"
        onClick={handleSignup}
      >
        Sign up
      </LoadingButton>
      <Typography variant="overline">
        Developed by Jonathan Laksana 2023
      </Typography>
    </div>
  );
}

export default Login;
