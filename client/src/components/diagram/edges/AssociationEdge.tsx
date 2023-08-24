import { BaseEdge, Position, getBezierPath } from 'reactflow';

type AssociationEdgeProps = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

function AssociationEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: AssociationEdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <BaseEdge
      path={edgePath}
      markerStart="url(#1__height=50&type=arrow&width=50)"
    />
  );
}

export default AssociationEdge;
