import BugReportIcon from '@mui/icons-material/BugReport';
// import CodeIcon from '@mui/icons-material/Code';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/Header.css';
import ShareMenu from './ShareMenu';

type HeaderProps = {
  name: string | undefined;
  isEditor?: boolean;
};

function Header({ name, isEditor = false }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openShare, setOpenShare] = useState(false);

  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    setOpenShare(true);
    handleClose();
  };

  const handleDocs = () => {
    window.open('https://github.com/jlaksana/UML2Code/wiki', '_blank');
  };

  const handleBug = () => {
    window.open(
      'https://github.com/jlaksana/UML2Code/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=',
      '_blank'
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    handleClose();
    navigate('/');
  };

  return (
    <div className="header">
      <div className="left">
        <Tooltip title="Return home" placement="right">
          <Link to="/dashboard">
            <img src={logo} className="logo" alt="logo" />
          </Link>
        </Tooltip>
      </div>
      <div className="center">
        <Tooltip title="Rename diagram" placement="bottom">
          <span>{name}</span>
        </Tooltip>
      </div>
      <div className="right">
        <IconButton
          aria-label="more"
          size="large"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          {/* <MenuItem>
            <ListItemIcon>
              <CodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Code</ListItemText>
          </MenuItem> */}
          <MenuItem onClick={handleDocs}>
            <ListItemIcon>
              <MenuBookIcon fontSize="small" />
            </ListItemIcon>
            Documentation
          </MenuItem>
          <MenuItem onClick={handleBug}>
            <ListItemIcon>
              <BugReportIcon fontSize="small" />
            </ListItemIcon>
            Report Bug
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <KeyboardReturnIcon fontSize="small" />
            </ListItemIcon>
            Log out
          </MenuItem>
        </Menu>
      </div>
      <ShareMenu
        open={openShare}
        handleClose={() => setOpenShare(false)}
        isEditor={isEditor}
      />
    </div>
  );
}

export default Header;
