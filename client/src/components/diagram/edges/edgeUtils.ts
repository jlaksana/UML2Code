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

const getDiamondRefX = (targetPosition: Position) => {
  switch (targetPosition) {
    case Position.Top:
      return 12;
    case Position.Left:
      return 19;
    default:
      throw new Error(`Invalid position: ${targetPosition}`);
  }
};

const getDiamondRefY = (targetPosition: Position) => {
  switch (targetPosition) {
    case Position.Top:
      return 19;
    case Position.Left:
      return 12;
    default:
      throw new Error(`Invalid position: ${targetPosition}`);
  }
};

export { getDiamondRefX, getDiamondRefY, getMarkerRotation };
