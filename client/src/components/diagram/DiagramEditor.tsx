import axios from 'axios';
import { MouseEvent, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
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
export const nodeColor = (node: Entity) => {
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

function DiagramEditor() {
  const entities = useEntities();
  const entitiesDispatch = useEntitiesDispatch();
  const relationships = useRelationships();
  const relationshipsDispatch = useRelationshipsDispatch();
  const edgeUpdateSuccessful = useRef(true);

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

  const onNodesChange = useCallback(
    async (changes: NodeChange[]) =>
      entitiesDispatch({
        type: 'SET_ENTITIES',
        payload: applyNodeChanges(changes, entities),
      }),
    [entities, entitiesDispatch]
  );

  // call api to update node position when drag stops
  const onNodeDragStop = useCallback(
    async (event: MouseEvent, node: Entity) => {
      event.stopPropagation();
      try {
        const newPos = { x: node.position.x, y: node.position.y };
        await axios.put(`/api/entity/${node.id}/position`, newPos);
      } catch (e) {
        setAlert(
          'Could not update position. Please try again',
          AlertType.ERROR
        );
      }
    },
    [setAlert]
  );

  // handle node deletion via delete key
  const onNodesDelete = useCallback(
    async (nodes: Entity[]) => {
      try {
        const nodeToDelete = nodes[0];
        await axios.delete(`/api/entity/${nodeToDelete.id}`);
        entitiesDispatch({ type: 'DELETE_ENTITY', id: nodeToDelete.id });
        setAlert('Entity successfully deleted', AlertType.SUCCESS);
      } catch (e) {
        setAlert('Could not delete entity. Try again', AlertType.ERROR);
      }
    },
    [entitiesDispatch, setAlert]
  );

  const onConnect = useCallback(() => {
    setAlert(
      'Unsupported Action - Please use the relationship form',
      AlertType.INFO
    );
  }, [setAlert]);

  // handle select and remove of edges
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      relationshipsDispatch({
        type: 'SET_RELATIONSHIPS',
        payload: applyEdgeChanges(changes, relationships),
      }),
    [relationships, relationshipsDispatch]
  );

  // handle edge position updates, three separate handlers used to better alert the user of errors
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    async (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      const newEdge = {
        ...oldEdge,
        ...newConnection,
        id: oldEdge.id,
      } as Edge;
      try {
        relationshipsDispatch({
          type: 'UPDATE_RELATIONSHIP',
          payload: newEdge,
        });
        await axios.put(`/api/relationship/${oldEdge.id}/handle`, {
          type: oldEdge.type,
          ...newConnection,
        });
      } catch (e) {
        setAlert(
          'Cannot update relationship to that node and port. Try again',
          AlertType.ERROR
        );
        relationshipsDispatch({
          type: 'UPDATE_RELATIONSHIP',
          payload: oldEdge,
        });
      }
    },
    [relationshipsDispatch, setAlert]
  );

  const onEdgeUpdateEnd = useCallback(() => {
    if (!edgeUpdateSuccessful.current) {
      setAlert('Could not detect a port', AlertType.WARNING);
    }
    edgeUpdateSuccessful.current = true;
  }, [setAlert]);

  // handle edge deletion via delete key
  const onEdgeDelete = useCallback(
    async (edges: Edge[]) => {
      try {
        const edgeToDelete = edges[0];
        await axios.delete(`/api/relationship/${edgeToDelete.id}`);
        relationshipsDispatch({
          type: 'DELETE_RELATIONSHIP',
          id: edgeToDelete.id,
        });
        setAlert('Relationship successfully deleted', AlertType.SUCCESS);
      } catch (e) {
        setAlert('Could not delete relationship. Try again', AlertType.ERROR);
      }
    },
    [relationshipsDispatch, setAlert]
  );

  return (
    <div className="diagram">
      <ReactFlow
        fitView
        nodes={entities}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        edges={relationships}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgesDelete={onEdgeDelete}
        connectionMode={ConnectionMode.Loose}
      >
        <Background color="#444" variant={'dots' as BackgroundVariant} />
        <Controls style={{ flexDirection: 'column', gap: 0, margin: '3em' }} />
        <MiniMap pannable zoomable position="top-right" nodeColor={nodeColor} />
      </ReactFlow>
    </div>
  );
}

export default DiagramEditor;
