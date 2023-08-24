import { Position } from 'reactflow';

const getMarkerRotation = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return '0deg';
    case Position.Right:
      return '270deg';
    default:
      throw new Error(`Invalid position: ${sourcePosition}`);
  }
};

export default getMarkerRotation;
