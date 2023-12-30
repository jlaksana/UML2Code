import BugReportIcon from '@mui/icons-material/BugReport';
// import CodeIcon from '@mui/icons-material/Code';
import { Logout } from '@mui/icons-material';
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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/UML2.png';
import '../../styles/Header.css';
import RenameModal from '../forms/modals/RenameModal';
import ShareMenu from './ShareMenu';

type HeaderProps = {
  name: string | undefined;
  isEditor?: boolean;
  handleRename?: (name: string) => void;
};

function Header({ name, isEditor = false, handleRename }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openShare, setOpenShare] = useState(false);
  const [renameModalName, setRenameModalName] = useState<string | undefined>();

  const user = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const { diagramId } = useParams();

  const handleOpenRename = () => {
    setRenameModalName(name);
  };

  const handleRenameClose = (newName: string | undefined) => {
    if (newName && handleRename) {
      handleRename(newName);
    }
    setRenameModalName(undefined);
  };

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
        {isEditor ? (
          <Tooltip title="Rename diagram" placement="bottom">
            <Typography variant="h6" onClick={handleOpenRename}>
              {name}
            </Typography>
          </Tooltip>
        ) : (
          <Typography variant="h6">{name}</Typography>
        )}
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
          {user && (
            <MenuItem onClick={handleShare}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
          )}
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
          {user && (
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          )}
        </Menu>
      </div>
      <ShareMenu
        open={openShare}
        handleClose={() => setOpenShare(false)}
        isEditor={isEditor}
      />
      <RenameModal
        prevName={renameModalName}
        handleClose={handleRenameClose}
        diagramId={diagramId as string}
      />
    </div>
  );
}

export default Header;
