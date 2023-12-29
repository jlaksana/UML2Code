import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MiniMap,
} from 'reactflow';
import { Entity, Relationship } from '../../types';
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

type Props = {
  entities: Entity[];
  relationships: Relationship[];
};

function DiagramViewer({ entities, relationships }: Props) {
  return (
    <div className="diagram">
      <ReactFlow
        fitView
        nodes={entities}
        nodeTypes={nodeTypes}
        edges={relationships}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
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
