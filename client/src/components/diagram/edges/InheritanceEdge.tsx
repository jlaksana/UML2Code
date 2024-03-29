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

export function InheritanceEdgeView({
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
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            id={id}
            viewBox="0 0 40 40"
            markerHeight={50}
            markerWidth={50}
            refX={12}
            refY={8}
            orient={getMarkerRotation(sourcePosition)}
          >
            <path
              d="M4.2433 17.6513
              L10.5859 5.67095
              C11.0445 4.80456 11.2739 4.37136 11.5798 4.22973
              C11.8463 4.10637 12.1535 4.10637 12.42 4.22973
              C12.726 4.37136 12.9553 4.80456 13.414 5.67094
              L19.7565 17.6513
              C20.1668 18.4263 20.372 18.8138 20.3305 19.13
              C20.2943 19.4059 20.1448 19.6543 19.9179 19.8154
              C19.6579 19.9999 19.2194 19.9999 18.3425 19.9999
              H5.65737
              C4.78044 19.9999 4.34198 19.9999 4.08198 19.8154
              C3.85505 19.6543 3.70551 19.4059 3.66932 19.13
              C3.62785 18.8138 3.833 18.4263 4.2433 17.6513Z"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#eee"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge path={edgePath} markerStart={`url(#${id})`} />
    </>
  );
}

function InheritanceEdge({
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
      <InheritanceEdgeView
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
        relationshipType="Inheritance"
      />
    </>
  );
}

export default InheritanceEdge;
