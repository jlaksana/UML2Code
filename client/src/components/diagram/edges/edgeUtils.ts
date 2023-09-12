import { Position } from 'reactflow';

const getMarkerRotation = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return '0deg';
    case Position.Right:
      return '270deg';
    case Position.Left:
      return '90deg';
    default:
      throw new Error(`Invalid position: ${sourcePosition}`);
  }
};

const getDiamondRefX = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return 11.5;
    case Position.Left:
      return 19;
    case Position.Right:
      return 5;
    default:
      throw new Error(`Invalid position: ${sourcePosition}`);
  }
};

const getDiamondRefY = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return 5;
    case Position.Left:
      return 12;
    case Position.Right:
      return 12;
    default:
      throw new Error(`Invalid position: ${sourcePosition}`);
  }
};

export { getDiamondRefX, getDiamondRefY, getMarkerRotation };
