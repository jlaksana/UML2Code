import { Button } from '@mui/material';
import axios from 'axios';
import { memo, useState } from 'react';
import { NodeProps, NodeToolbar } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/Node.css';
import { Attribute, Constant, Klass, Method } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import ClassModal from '../../forms/modals/ClassModal';
import Handles from './Handles';

function ClassNode({ id, data }: NodeProps<Klass>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const { setAlert } = useAlert();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/entity/${id}`);
      entitiesDispatch({ type: 'DELETE_ENTITY', id });
    } catch (e) {
      setAlert('Could not delete class. Try again', AlertType.ERROR);
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
