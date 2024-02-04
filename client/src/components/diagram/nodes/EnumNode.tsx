import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NodeProps } from 'reactflow';
import { useEntitiesDispatch } from '../../../context/EntitiesContext';
import { Enum, EnumValue } from '../../../types';
import { AlertType } from '../../alert/AlertContext';
import useAlert from '../../alert/useAlert';
import EnumModal from '../../forms/modals/EnumModal';
import Handles from './Handles';
import NodeToolBarCustom from './NodeToolBarCustom';

export function EnumNodeView({ data }: { data: Enum }) {
  return (
    <>
      <Handles />
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
    </>
  );
}

function EnumNode({ id, data }: NodeProps<Enum>) {
  const [editOpen, setEditOpen] = useState(false);
  const entitiesDispatch = useEntitiesDispatch();

  const { setAlert } = useAlert();
  const { diagramId } = useParams();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/entity/${id}?diagramId=${diagramId}`);
      entitiesDispatch({ type: 'DELETE_ENTITY', id });
      setAlert('Enum successfully deleted', AlertType.SUCCESS);
    } catch (e) {
      setAlert('Could not delete enum. Try again', AlertType.ERROR);
    }
  };

  return (
    <>
      <NodeToolBarCustom
        setEditOpen={setEditOpen}
        handleDelete={handleDelete}
      />
      <div onDoubleClick={() => setEditOpen(true)}>
        <EnumNodeView data={data} />
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
