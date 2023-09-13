import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import EdgeLabel from './EdgeLabel';
import RelationshipToolBar from './RelationshipToolBar';

function AssociationEdge({
  id,
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
          x={sourceX + 10}
          y={sourceY}
        />
        <EdgeLabel
          label={data?.tgtMultiplicity}
          position="target"
          x={targetX + 10}
          y={targetY}
        />
        {selected && (
          <RelationshipToolBar labelX={labelX} labelY={labelY} id={id} />
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default AssociationEdge;
