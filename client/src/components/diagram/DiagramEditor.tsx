import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { MouseEvent, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  ControlButton,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  getRectOfNodes,
  getTransformForBounds,
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
import { Entity, Relationship } from '../../types';
import { AlertType } from '../alert/AlertContext';
import useAlert from '../alert/useAlert';
import AggregationEdge from './edges/AggregationEdge';
import AssociationEdge from './edges/AssociationEdge';
import CompositionEdge from './edges/CompositionEdge';
import DependencyEdge from './edges/DependencyEdge';
import ImplementationEdge from './edges/ImplementationEdge';
import InheritanceEdge from './edges/InheritanceEdge';
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
  Implementation: ImplementationEdge,
  Aggregation: AggregationEdge,
  Composition: CompositionEdge,
};

type Props = {
  ent: Entity[];
  rel: Relationship[];
};

function DiagramEditor({ ent, rel }: Props) {
  const entities = useEntities();
  const entitiesDispatch = useEntitiesDispatch();
  const relationships = useRelationships();
  const relationshipsDispatch = useRelationshipsDispatch();
  const edgeUpdateSuccessful = useRef(true);

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    entitiesDispatch({ type: 'SET_ENTITIES', payload: ent });
    relationshipsDispatch({ type: 'SET_RELATIONSHIPS', payload: rel });
  }, [entitiesDispatch, relationshipsDispatch, ent, rel]);

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
        await axios.put(
          `/api/entity/${node.id}/position?diagramId=${diagramId}`,
          newPos
        );
      } catch (e) {
        setAlert(
          'Could not update position. Please try again',
          AlertType.ERROR
        );
      }
    },
    [diagramId, setAlert]
  );

  // handle node deletion via delete key
  const onNodesDelete = useCallback(
    async (nodes: Entity[]) => {
      try {
        const nodeToDelete = nodes[0];
        await axios.delete(
          `/api/entity/${nodeToDelete.id}?diagramId=${diagramId}`
        );
        entitiesDispatch({ type: 'DELETE_ENTITY', id: nodeToDelete.id });
        setAlert('Entity successfully deleted', AlertType.SUCCESS);
      } catch (e) {
        setAlert('Could not delete entity. Try again', AlertType.ERROR);
      }
    },
    [diagramId, entitiesDispatch, setAlert]
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
        await axios.put(
          `/api/relationship/${oldEdge.id}/handle?diagramId=${diagramId}`,
          {
            type: oldEdge.type,
            ...newConnection,
          }
        );
      } catch (e) {
        setAlert('Cannot update relationship to that entity', AlertType.ERROR);
        relationshipsDispatch({
          type: 'UPDATE_RELATIONSHIP',
          payload: oldEdge,
        });
      }
    },
    [diagramId, relationshipsDispatch, setAlert]
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
        await axios.delete(
          `/api/relationship/${edgeToDelete.id}?diagramId=${diagramId}`
        );
        relationshipsDispatch({
          type: 'DELETE_RELATIONSHIP',
          id: edgeToDelete.id,
        });
        setAlert('Relationship successfully deleted', AlertType.SUCCESS);
      } catch (e) {
        setAlert('Could not delete relationship. Try again', AlertType.ERROR);
      }
    },
    [diagramId, relationshipsDispatch, setAlert]
  );

  // gets the diagram contents and viewport and downloads it as a png
  const handleDownload = async () => {
    setAlert('Downloading diagram...', AlertType.INFO);
    const nodesBounds = getRectOfNodes(entities);
    const imageWidth = 1800;
    const imageHeight = 1200;
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    const viewport = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement;
    if (viewport) {
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#faf9f6',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: String(imageWidth),
          height: String(imageHeight),
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      });

      const now = new Date();
      const link = document.createElement('a');
      link.download = `diagram${diagramId}-${now.toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
      setAlert('Diagram successfully downloaded', AlertType.SUCCESS);
    }
  };

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
        <Controls style={{ flexDirection: 'column', gap: 0, margin: '3em' }}>
          <ControlButton onClick={handleDownload} title="Download Diagram">
            <DownloadIcon />
          </ControlButton>
        </Controls>
        <MiniMap pannable zoomable position="top-right" nodeColor={nodeColor} />
      </ReactFlow>
    </div>
  );
}

export default DiagramEditor;
