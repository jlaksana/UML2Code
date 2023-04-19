import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/UML2.png';
import '../styles/Header.css';

function Header() {
  const { id } = useParams();

  return (
    <div className="header">
      <div className="left">
        <Link to="/">
          <img src={logo} className="logo2" alt="logo" />
        </Link>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          New
        </Button>
      </div>
      <div className="center">
        <span>ID: {id}</span>
      </div>
      <div className="right">
        <Button variant="contained" startIcon={<IosShareIcon />} size="large">
          Share
        </Button>
        <Button variant="contained" startIcon={<CodeIcon />} size="large">
          Code
        </Button>
      </div>
    </div>
  );
}

export default Header;
