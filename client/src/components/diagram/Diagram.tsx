import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeChange,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/base.css';
import {
  useEntities,
  useEntitiesDispatch,
} from '../../context/EntitiesContext';
import '../../styles/Editor.css';
import ClassNode from './nodes/ClassNode';

const nodeTypes = { class: ClassNode };

// ! for testing purposes only
const initialEdges: Edge[] = [
  { id: '1-2', source: '1', target: '2', type: 'step' },
];

function Diagram() {
  const entities = useEntities();
  const entitiesDispatch = useEntitiesDispatch();
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      entitiesDispatch({
        type: 'UPDATE_NODES',
        payload: applyNodeChanges(changes, entities),
      });
    },
    [entities, entitiesDispatch]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="diagram">
      <ReactFlow
        nodes={entities}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background color="#444" variant={'dots' as BackgroundVariant} />
        <Controls style={{ flexDirection: 'column', gap: 0, margin: '3em' }} />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
