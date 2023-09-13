import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import EdgeLabel from './EdgeLabel';
import RelationshipToolBar from './RelationshipToolBar';
import { getDiamondRefX, getDiamondRefY } from './edgeUtils';

function CompositionEdge({
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
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            id={id}
            viewBox="0 0 40 40"
            markerHeight={50}
            markerWidth={50}
            refX={getDiamondRefX(sourcePosition)}
            refY={getDiamondRefY(sourcePosition)}
          >
            <path
              d="M4.26244 14.2628C3.47041 13.4707 3.07439 13.0747 2.92601 12.618
              C2.7955 12.2164 2.7955 11.7837 2.92601 11.382
              C3.07439 10.9253 3.47041 10.5293 4.26244 9.73727
              L9.73703 4.26268
              C10.5291 3.47065 10.9251 3.07463 11.3817 2.92626
              C11.7834 2.79574 12.2161 2.79574 12.6178 2.92626
              C13.0745 3.07463 13.4705 3.47065 14.2625 4.26268
              L19.7371 9.73727
              C20.5291 10.5293 20.9251 10.9253 21.0735 11.382
              C21.204 11.7837 21.204 12.2164 21.0735 12.618
              C20.9251 13.0747 20.5291 13.4707 19.7371 14.2628
              L14.2625 19.7373
              C13.4705 20.5294 13.0745 20.9254 12.6178 21.0738
              C12.2161 21.2043 11.7834 21.2043 11.3817 21.0738C10.9251 20.9254 10.5291 20.5294 9.73703 19.7373
              L4.26244 14.2628Z"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#555"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge path={edgePath} markerStart={`url(#${id})`} />
      <EdgeLabelRenderer>
        <EdgeLabel
          label={data?.label}
          position="middle"
          x={labelX}
          y={labelY}
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

export default CompositionEdge;
