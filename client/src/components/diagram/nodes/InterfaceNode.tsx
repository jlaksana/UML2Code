import { Button } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import { Constant, Interface, Method } from '../../../types';
import InterfaceModal from '../../forms/modals/InterfaceModal';

function InterfaceNode({ id, data }: NodeProps<Interface>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const handleDelete = () => {
    entitiesDispatch({ type: 'DELETE_INTERFACE', payload: null, id });
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
      <div className="node" style={{ backgroundColor: '#b1f3b1' }}>
        <div className="node-header">
          <div className="node-supertitle">{'<interface>'}</div>
          <div className="node-title">{data.name}</div>
        </div>
        <hr />
        <div className="node-body">
          <div className="node-attributes">
            {data.constants &&
              data.constants.map((constant: Constant) => (
                <div className="node-attribute" key={constant.id}>
                  {`+ ${constant.name}: ${constant.type} <static>`}
                </div>
              ))}
          </div>
          <hr />
          <div className="node-methods">
            {data.methods &&
              data.methods.map((method: Method) => (
                <div className="node-method" key={method.id}>
                  {method.visibility} {method.name}(): {method.returnType}{' '}
                  {method.isStatic ? '<static>' : ''}
                </div>
              ))}
          </div>
        </div>
      </div>
      <Handle id="c" type="source" position={Position.Right} />
      <Handle id="d" type="source" position={Position.Bottom} />
      <InterfaceModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        id={id}
        data={data}
      />
    </>
  );
}

export default InterfaceNode;
