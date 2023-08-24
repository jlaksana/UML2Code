import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
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
import { AlertType } from '../alert/AlertContext';
import useAlert from '../alert/useAlert';
import AggregationEdge from './edges/AggregationEdge';
import AssociationEdge from './edges/AssociationEdge';
import CompositionEdge from './edges/CompositionEdge';
import DependencyEdge from './edges/DependencyEdge';
import InheritanceEdge from './edges/InheritanceEdge';
import RealizationEdge from './edges/RealizationEdge';
import ClassNode from './nodes/ClassNode';
import EnumNode from './nodes/EnumNode';
import InterfaceNode from './nodes/InterfaceNode';

// define node types and their components
const nodeTypes = {
  class: ClassNode,
  interface: InterfaceNode,
  enum: EnumNode,
};

// handle colors for minimap
const nodeColor = (node: Entity<NodeData>) => {
  switch (node.type) {
    case 'class':
      return '#D4F1F4';
    case 'interface':
      return '#b1f3b1';
    case 'enum':
      return '#ffcccb';
    default:
      return '#ffffff';
  }
};

const edgeTypes = {
  inheritance: InheritanceEdge,
  association: AssociationEdge,
  dependency: DependencyEdge,
  realization: RealizationEdge,
  aggregation: AggregationEdge,
  composition: CompositionEdge,
};

// ! for testing purposes only
const initialEdges: Edge[] = [
  {
    id: '1-2',
    source: '64973d9948d50a631ba3d9ce',
    sourceHandle: 'bottom-right',
    target: '649741cd48d50a631ba3d9db',
    type: 'association',
    markerStart: { type: MarkerType.Arrow, width: 50, height: 50 },
  },
  {
    id: '2-1',
    source: '64973d9948d50a631ba3d9ce',
    sourceHandle: 'bottom-left',
    target: '649741cd48d50a631ba3d9db',
    type: 'dependency',
  },
  {
    id: '3-1',
    source: '64973d9948d50a631ba3d9ce',
    sourceHandle: 'right-bottom',
    target: '649741cd48d50a631ba3d9db',
    targetHandle: 'top-right',
    type: 'inheritance',
  },
  {
    id: '3-2',
    source: '64973d9948d50a631ba3d9ce',
    sourceHandle: 'right-top',
    target: '649741cd48d50a631ba3d9db',
    targetHandle: 'top-right',
    type: 'realization',
  },
  {
    id: '4-2',
    source: '649741cd48d50a631ba3d9db',
    sourceHandle: 'right-top',
    target: '64c57efc7a546ae970012685',
    targetHandle: 'top-right',
    type: 'aggregation',
  },
  {
    id: '4-3',
    source: '649741cd48d50a631ba3d9db',
    sourceHandle: 'right-bottom',
    target: '64c57efc7a546ae970012685',
    targetHandle: 'top-right',
    type: 'composition',
  },
];

function Diagram() {
  const entities = useEntities();
  const entitiesDispatch = useEntitiesDispatch();
  const [edges, setEdges] = useState(initialEdges);

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    const fetchDiagramContents = async () => {
      try {
        const res = await axios.get(`/api/diagram/${diagramId}/contents`);
        entitiesDispatch({ type: 'SET_NODES', payload: res.data.entities });
        // TODO set edges here
      } catch (e) {
        setAlert(
          'Could not fetch diagram contents. Try again',
          AlertType.ERROR
        );
      }
    };

    fetchDiagramContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId, entitiesDispatch]);

  const getEntityPosition = (id: string, ents: Entity<NodeData>[]) => {
    const entity = ents.find((e) => e.id === id);
    if (!entity) return { x: 0, y: 0 };
    return entity.position;
  };

  const onNodesChange = useCallback(
    async (changes: NodeChange[]) => {
      const newEntities = applyNodeChanges(changes, entities);
      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging === false
      ) {
        // user stopped dragging a node
        try {
          const updatedId = changes[0].id;
          const newPos = getEntityPosition(updatedId, newEntities);
          await axios.put(`/api/entity/${updatedId}/position`, newPos);
          entitiesDispatch({ type: 'END_UPDATE_NODES', payload: newEntities });
        } catch (e) {
          setAlert('Server error. Please try again', AlertType.ERROR);
        }
      } else {
        entitiesDispatch({
          type: 'UPDATE_NODES',
          payload: applyNodeChanges(changes, entities),
        });
      }
    },
    [entities, entitiesDispatch, setAlert]
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
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        deleteKeyCode={null}
      >
        <Background color="#444" variant={'dots' as BackgroundVariant} />
        <Controls style={{ flexDirection: 'column', gap: 0, margin: '3em' }} />
        <MiniMap pannable zoomable position="top-right" nodeColor={nodeColor} />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
