import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/base.css';
import {
  useEntities,
  useEntitiesDispatch,
} from '../../context/EntitiesContext';
import {
  useRelationships,
  useRelationshipsDispatch,
} from '../../context/RelationshipsContext';
import '../../styles/Editor.css';
import { Entity } from '../../types';
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

// define node types and their custom components
const nodeTypes = {
  class: ClassNode,
  interface: InterfaceNode,
  enum: EnumNode,
};

// handle colors for minimap
const nodeColor = (node: Entity) => {
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

// define edge types and their custom components
const edgeTypes = {
  Inheritance: InheritanceEdge,
  Association: AssociationEdge,
  Dependency: DependencyEdge,
  Realization: RealizationEdge,
  Aggregation: AggregationEdge,
  Composition: CompositionEdge,
};

function Diagram() {
  const entities = useEntities();
  const entitiesDispatch = useEntitiesDispatch();
  const relationships = useRelationships();
  const relationshipsDispatch = useRelationshipsDispatch();

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    const fetchDiagramContents = async () => {
      try {
        const res = await axios.get(`/api/diagram/${diagramId}/contents`);
        entitiesDispatch({ type: 'SET_ENTITIES', payload: res.data.entities });
        relationshipsDispatch({
          type: 'SET_RELATIONSHIPS',
          payload: res.data.relationships,
        });
      } catch (e) {
        setAlert(
          'Could not fetch diagram contents. Try again',
          AlertType.ERROR
        );
      }
    };
    fetchDiagramContents();
  }, [diagramId, entitiesDispatch, relationshipsDispatch, setAlert]);

  const getEntityPosition = (id: string, ents: Entity[]) => {
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
          // TODO investigate if we can update one node from the nodeChange
          entitiesDispatch({ type: 'SET_ENTITIES', payload: newEntities });
        } catch (e) {
          setAlert('Server error. Please try again', AlertType.ERROR);
        }
      } else {
        entitiesDispatch({
          type: 'SET_ENTITIES',
          payload: applyNodeChanges(changes, entities),
        });
      }
    },
    [entities, entitiesDispatch, setAlert]
  );

  // handle select and remove of edges
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      // TODO find out if we can update one edge from the edgeChange
      relationshipsDispatch({
        type: 'SET_RELATIONSHIPS',
        payload: applyEdgeChanges(changes, relationships),
      }),
    [relationships, relationshipsDispatch]
  );

  // handle edge source and target updates
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      // TODO validate then update edge in db
      // TODO find out if we can update one edge from newConnection
      relationshipsDispatch({
        type: 'SET_RELATIONSHIPS',
        payload: updateEdge(oldEdge, newConnection, relationships),
      }),
    [relationships, relationshipsDispatch]
  );

  return (
    <div className="diagram">
      <ReactFlow
        nodes={entities}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={relationships}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
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
