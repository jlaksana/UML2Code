import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { NodeProps, NodeToolbar } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import { Enum, EnumValue } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import EnumModal from '../../forms/modals/EnumModal';
import Handles from './Handles';

function EnumNode({ id, data }: NodeProps<Enum>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const { setAlert } = useAlert();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/entity/${id}`);
      entitiesDispatch({ type: 'DELETE_ENTITY', id });
    } catch (e) {
      setAlert('Could not delete enum. Try again', AlertType.ERROR);
    }
  };

  return (
    <>
      <Handles />
      <NodeToolbar className="node-toolbar">
        <Button
          variant="contained"
          size="small"
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </NodeToolbar>
      <div className="node" style={{ backgroundColor: '#ffcccb' }}>
        <div className="node-header">
          <div className="node-supertitle">{'<enumeration>'}</div>

          <div className="node-title">{data.name}</div>
        </div>
        <hr />
        <div className="node-body">
          <div className="node-attributes">
            {data.values &&
              data.values.map((constant: EnumValue) => (
                <div className="node-attribute" key={constant.id}>
                  {constant.name}
                </div>
              ))}
          </div>
        </div>
      </div>
      <EnumModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        id={id}
        data={data}
      />
    </>
  );
}

export default EnumNode;
