import { Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logo from '../../assets/UML2.png';

function Verify() {
  const [verified, setVerified] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await axios.post('/api/auth/verify', {
          token: searchParams.get('token'),
        });
      } catch (e: any) {
        setVerified(false);
        setErrorMessage(e.response.data.message);
      }
    };
    verifyAccount();
  }, [searchParams]);

  return (
    <div className="start-menu">
      <div>
        <img src={logo} className="logo" alt="logo" />
      </div>
      {verified ? (
        <>
          <Typography variant="h5">Account verified</Typography>
          <Link to="/login">Go back to login</Link>
        </>
      ) : (
        <Typography variant="h5">
          Could not verify your account. {errorMessage}
        </Typography>
      )}
    </div>
  );
}

export default Verify;
