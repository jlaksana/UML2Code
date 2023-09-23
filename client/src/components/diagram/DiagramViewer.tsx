import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from 'reactflow';
import { AlertType } from '../alert/AlertContext';
import useAlert from '../alert/useAlert';
import { nodeColor } from './DiagramEditor';
import { AggregationEdgeView } from './edges/AggregationEdge';
import { AssociationEdgeView } from './edges/AssociationEdge';
import { CompositionEdgeView } from './edges/CompositionEdge';
import { DependencyEdgeView } from './edges/DependencyEdge';
import { InheritanceEdgeView } from './edges/InheritanceEdge';
import { RealizationEdgeView } from './edges/RealizationEdge';
import { ClassNodeView } from './nodes/ClassNode';
import { EnumNodeView } from './nodes/EnumNode';
import { InterfaceNodeView } from './nodes/InterfaceNode';

// define node types and their custom components
const nodeTypes = {
  class: ClassNodeView,
  interface: InterfaceNodeView,
  enum: EnumNodeView,
};

// define edge types and their custom components
const edgeTypes = {
  Inheritance: InheritanceEdgeView,
  Association: AssociationEdgeView,
  Dependency: DependencyEdgeView,
  Realization: RealizationEdgeView,
  Aggregation: AggregationEdgeView,
  Composition: CompositionEdgeView,
};

function DiagramViewer() {
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    const fetchDiagramContents = async () => {
      try {
        const res = await axios.get(
          `/api/diagram/${diagramId}/public/contents`
        );
        setEntities(res.data.entities);
        setRelationships(res.data.relationships);
      } catch (e) {
        setAlert('This diagram is not available to view.', AlertType.ERROR);
      }
    };
    fetchDiagramContents();
  }, [diagramId, setAlert]);

  return (
    <div className="diagram">
      <ReactFlow
        fitView
        nodes={entities}
        nodeTypes={nodeTypes}
        edges={relationships}
        edgeTypes={edgeTypes}
      >
        <Background color="#444" variant={'dots' as BackgroundVariant} />
        <Controls
          showInteractive={false}
          style={{ flexDirection: 'column', gap: 0, margin: '3em' }}
        />
        <MiniMap
          pannable
          zoomable
          position="bottom-right"
          nodeColor={nodeColor}
        />
      </ReactFlow>
    </div>
  );
}

export default DiagramViewer;
