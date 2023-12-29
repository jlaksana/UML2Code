import { Logout } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/UML2.png';

function DashHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // TODO: implement handleProfile and profile page
  const handleProfile = () => {
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    navigate('/login');
    handleClose();
  };

  return (
    <>
      <div className="header">
        <div className="left">
          <img src={logo} className="logo" alt="logo" />
        </div>
        <div className="right">
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <Avatar sx={{ width: 32, height: 32, marginRight: 2 }} /> {username}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default DashHeader;
