import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { NodeToolbar } from 'reactflow';

type Props = {
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
};

function NodeToolBarCustom({ setEditOpen, handleDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDeleteLoading = async () => {
    setLoading(true);
    await handleDelete();
    setLoading(false);
  };

  return (
    <NodeToolbar className="node-toolbar">
      <Tooltip title="Edit" placement="left">
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => setEditOpen(true)}
          disabled={loading}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="right">
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteLoading}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </NodeToolbar>
  );
}

export default NodeToolBarCustom;
