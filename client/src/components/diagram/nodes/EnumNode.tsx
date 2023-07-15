import { Button } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import { Enum, EnumValue } from '../../../types';
import EnumModal from '../../forms/modals/EnumModal';

function EnumNode({ id, data }: NodeProps<Enum>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const handleDelete = () => {
    entitiesDispatch({ type: 'DELETE_ENUM', payload: null, id });
  };

  return (
    <>
      <Handle id="a" type="target" position={Position.Top} />
      <Handle id="b" type="target" position={Position.Left} />
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
      <Handle id="c" type="source" position={Position.Right} />
      <Handle id="d" type="source" position={Position.Bottom} />
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
