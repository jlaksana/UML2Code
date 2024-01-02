import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diagram } from '../types';
import { AlertType } from './alert/AlertContext';
import useAlert from './alert/useAlert';
import RenameModal from './forms/modals/RenameModal';

type Props = {
  diagrams: Diagram[];
  handleDeleteDiagram: (diagramId: string) => void;
  handleRenameDiagram: (diagramId: string, name: string) => void;
};

const parseDate = (date: string) => {
  const d = new Date(date);
  return d.toDateString().slice(4);
};

function DashTable({
  diagrams,
  handleDeleteDiagram,
  handleRenameDiagram,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [renameModalName, setRenameModalName] = useState<string | undefined>();
  const [renameDiagramId, setRenameDiagramId] = useState<string | undefined>();

  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDiagram = (event: React.MouseEvent<HTMLElement>) => {
    const diagramId = event.currentTarget.id;
    navigate(`/${diagramId}/edit`);
  };

  const handleOpenFromMenu = () => {
    const diagramId = anchorEl?.parentElement?.parentElement?.id;
    navigate(`/${diagramId}/edit`);
    handleClose();
  };

  const handleRename = () => {
    const diagramId = anchorEl?.parentElement?.parentElement?.id;
    setRenameDiagramId(diagramId);
    const prevName =
      anchorEl?.parentElement?.parentElement?.firstChild?.textContent;
    setRenameModalName(prevName as string);
    handleClose();
  };

  const handleRenameClose = (name: string | undefined) => {
    if (name) {
      handleRenameDiagram(renameDiagramId as string, name);
    }
    setRenameModalName(undefined);
    setRenameDiagramId(undefined);
  };

  const handleDelete = async () => {
    const diagramId = anchorEl?.parentElement?.parentElement?.id;
    try {
      await axios.delete(`/api/diagram/${diagramId}`);
      setAlert('Diagram deleted', AlertType.SUCCESS);
      handleDeleteDiagram(diagramId as string);
    } catch (err) {
      setAlert('Error deleting diagram. Please try again.', AlertType.ERROR);
    }
    handleClose();
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ marginTop: 3, marginBottom: 3, width: '80%', maxHeight: '80vh' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Last Modified</TableCell>
              <TableCell align="right" width={10} />
            </TableRow>
          </TableHead>
          <TableBody>
            {diagrams.map((diagram) => (
              <TableRow
                key={diagram.id}
                id={diagram.id}
                onDoubleClick={handleOpenDiagram}
              >
                <TableCell component="th" scope="row">
                  <Tooltip title="Double click to open">
                    <span>{diagram.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={new Date(diagram.modified).toString()}>
                    <span>{parseDate(diagram.modified)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="More Actions">
                    <IconButton
                      aria-label="more"
                      size="large"
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleOpen}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="diagram-more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenFromMenu}>
          <ListItemIcon>
            <OpenInBrowserIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRename}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <RenameModal
        prevName={renameModalName}
        handleClose={handleRenameClose}
        diagramId={renameDiagramId as string}
      />
    </>
  );
}

export default DashTable;
