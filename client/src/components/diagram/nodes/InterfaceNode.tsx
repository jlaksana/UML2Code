import axios from 'axios';
import { useState } from 'react';
import { NodeProps } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import '../../../styles/Node.css';
import { Constant, Interface, Method } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import InterfaceModal from '../../forms/modals/InterfaceModal';
import Handles from './Handles';
import NodeToolBarCustom from './NodeToolBarCustom';

function InterfaceNode({ id, data }: NodeProps<Interface>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const { setAlert } = useAlert();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/entity/${id}`);
      entitiesDispatch({ type: 'DELETE_ENTITY', id });
      setAlert('Interface successfully deleted', AlertType.SUCCESS);
    } catch (e) {
      setAlert('Could not delete interface. Try again', AlertType.ERROR);
    }
  };

  return (
    <>
      <Handles />
      <NodeToolBarCustom
        setEditOpen={setEditOpen}
        handleDelete={handleDelete}
      />
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
