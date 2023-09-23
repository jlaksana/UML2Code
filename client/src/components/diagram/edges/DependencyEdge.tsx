import { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import { RelationshipEditModal } from '../../forms/modals/RelationshipModal';
import RelationshipToolBar from './RelationshipToolBar';
import { getMarkerRotation } from './edgeUtils';

export function DependencyEdgeView({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
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
      <BaseEdge
        path={edgePath}
        style={{ strokeDasharray: '5, 5' }}
        markerStart={`url(#${id})`}
      />
    </>
  );
}

function DependencyEdge({
  id,
  source,
  target,
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
  const [open, setOpen] = useState(false);
  return (
    <>
      {selected && (
        <EdgeLabelRenderer>
          <RelationshipToolBar
            labelX={labelX}
            labelY={labelY}
            id={id}
            openEditModal={() => setOpen(true)}
          />
        </EdgeLabelRenderer>
      )}
      <DependencyEdgeView
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        sourcePosition={sourcePosition}
        targetPosition={targetPosition}
        id={id}
        source={source}
        target={target}
      />
      <RelationshipEditModal
        open={open}
        handleClose={() => setOpen(false)}
        id={id}
        relationshipType="Dependency"
      />
    </>
  );
}

export default DependencyEdge;
