import { Button } from '@mui/material';
import axios from 'axios';
import { memo, useState } from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/Node.css';
import { Attribute, Constant, Klass, Method } from '../../../types';
import ClassModal from '../../forms/modals/ClassModal';

function ClassNode({ id, data }: NodeProps<Klass>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/class/${id}`);
      entitiesDispatch({ type: 'DELETE_KLASS', payload: null, id });
    } catch (e) {
      // TODO error toast
      console.error(e);
    }
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
      <div className="node" style={{ backgroundColor: '#D4F1F4' }}>
        <div className="node-header">
          {data.isAbstract && (
            <div className="node-supertitle">{'<abstract>'}</div>
          )}
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
            {data.attributes &&
              data.attributes.map((attribute: Attribute) => (
                <div className="node-attribute" key={attribute.id}>
                  {attribute.visibility} {attribute.name}: {attribute.type}
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
      <ClassModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        id={id}
        data={data}
      />
    </>
  );
}

export default memo(ClassNode);
