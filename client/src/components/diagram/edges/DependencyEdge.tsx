import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import RelationshipToolBar from './RelationshipToolBar';
import { getMarkerRotation } from './edgeUtils';

function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <svg style={{ position: 'absolute', top: 1000, left: 1000 }}>
        <defs>
          <marker
            id={id}
            viewBox="0 0 40 40"
            markerHeight={70}
            markerWidth={70}
            refX={12}
            refY={8}
            orient={getMarkerRotation(sourcePosition)}
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </marker>
        </defs>
      </svg>
      {selected && (
        <EdgeLabelRenderer>
          <RelationshipToolBar labelX={labelX} labelY={labelY} id={id} />
        </EdgeLabelRenderer>
      )}
      <BaseEdge
        path={edgePath}
        style={{ strokeDasharray: '5, 5' }}
        markerStart={`url(#${id})`}
      />
    </>
  );
}

export default DependencyEdge;
