import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

function DependencyEdge({
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
    <BaseEdge
      path={edgePath}
      style={{ strokeDasharray: '5, 5' }}
      markerStart="url(#1__height=50&type=arrow&width=50)"
    />
  );
}

export default DependencyEdge;
