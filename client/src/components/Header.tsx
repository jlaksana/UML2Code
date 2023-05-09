import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Tooltip } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/UML2.png';
import '../styles/Header.css';

function Header() {
  const { id } = useParams();

  return (
    <div className="header">
      <div className="left">
        <Tooltip title="Return home" placement="right">
          <Link to="/">
            <img src={logo} className="logo" alt="logo" />
          </Link>
        </Tooltip>
      </div>
      <div className="center">
        <span>ID: {id}</span>
      </div>
      <div className="right">
        <Tooltip title="Share or print">
          <Button variant="contained" startIcon={<ShareIcon />}>
            Share
          </Button>
        </Tooltip>
        <Tooltip title="Generate code">
          <Button variant="contained" startIcon={<CodeRoundedIcon />}>
            Code
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Header;
