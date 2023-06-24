import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
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
import { Entity, NodeData } from '../../types';
import ClassNode from './nodes/ClassNode';

// define node types and their components
const nodeTypes = { class: ClassNode };

// handle colors for minimap
const nodeColor = (node: Entity<NodeData>) => {
  switch (node.type) {
    case 'class':
      return '#ffefff';
    default:
      return '#ff0072';
  }
};

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
      const newEntities = applyNodeChanges(changes, entities);
      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging === false
      ) {
        // user stopped dragging a node
        entitiesDispatch({ type: 'END_UPDATE_NODES', payload: newEntities });
      } else {
        entitiesDispatch({
          type: 'UPDATE_NODES',
          payload: applyNodeChanges(changes, entities),
        });
      }
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
        <MiniMap pannable zoomable position="top-right" nodeColor={nodeColor} />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
