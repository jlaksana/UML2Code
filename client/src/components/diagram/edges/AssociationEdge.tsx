import { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  Position,
  getBezierPath,
} from 'reactflow';
import { RelationshipEditModal } from '../../forms/modals/RelationshipModal';
import EdgeLabel from './EdgeLabel';
import RelationshipToolBar from './RelationshipToolBar';
import { getTgtLabelPositionX } from './edgeUtils';

export function AssociationEdgeView({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const getSrcLabelPositionX = () => {
    if (sourcePosition === Position.Left) {
      return sourceX - 10;
    }
    if (
      sourcePosition === Position.Right ||
      sourcePosition === Position.Bottom
    ) {
      return sourceX + 10;
    }
    return sourceX;
  };

  return (
    <>
      <BaseEdge path={edgePath} />;
      <EdgeLabelRenderer>
        <EdgeLabel
          label={data?.label}
          position="middle"
          x={labelX}
          y={labelY}
        />
        <EdgeLabel
          label={data?.srcMultiplicity}
          position="source"
          x={getSrcLabelPositionX()}
          y={sourceY}
        />
        <EdgeLabel
          label={data?.tgtMultiplicity}
          position="target"
          x={getTgtLabelPositionX(targetPosition, targetX)}
          y={targetY}
        />
      </EdgeLabelRenderer>
    </>
  );
}

function AssociationEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
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
      <AssociationEdgeView
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        sourcePosition={sourcePosition}
        targetPosition={targetPosition}
        data={data}
        id={id}
        source={source}
        target={target}
      />
      <EdgeLabelRenderer>
        {selected && (
          <RelationshipToolBar
            labelX={labelX}
            labelY={labelY}
            id={id}
            openEditModal={() => setOpen(true)}
          />
        )}
      </EdgeLabelRenderer>
      <RelationshipEditModal
        open={open}
        handleClose={() => setOpen(false)}
        id={id}
        relationshipType="Association"
      />
    </>
  );
}

export default AssociationEdge;
