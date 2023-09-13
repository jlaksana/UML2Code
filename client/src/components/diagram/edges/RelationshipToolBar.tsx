import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import { useRelationshipsDispatch } from '../../../context/RelationshipsContext';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';

type Props = {
  labelX: number;
  labelY: number;
  id: string;
};

function RelationshipToolBar({ labelX, labelY, id }: Props) {
  const relationshipsDispatch = useRelationshipsDispatch();
  const { setAlert } = useAlert();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/relationship/${id}`);
      relationshipsDispatch({
        type: 'DELETE_RELATIONSHIP',
        id,
      });
      setAlert('Relationship successfully deleted', AlertType.SUCCESS);
    } catch (e) {
      setAlert('Could not delete relationship. Try again', AlertType.ERROR);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px,${
          labelY - 25
        }px)`,
        fontSize: 12,
        pointerEvents: 'all',
      }}
      className="nodrag nopan"
    >
      <Tooltip title="Edit" placement="left">
        <IconButton aria-label="edit" color="primary">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="right">
        <IconButton aria-label="delete" color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default RelationshipToolBar;
