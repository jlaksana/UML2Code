import { Position } from 'reactflow';

const getMarkerRotation = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return '0deg';
    case Position.Right:
      return '270deg';
    case Position.Left:
      return '90deg';
    case Position.Top:
      return '180deg';
    default:
      // should never happen
      return '0deg';
  }
};

const getDiamondRefX = (sourcePosition: Position) => {
  switch (sourcePosition) {
    case Position.Bottom:
      return 12;
    case Position.Left:
      return 19;
    case Position.Right:
      return 5;
    case Position.Top:
      return 12;
    default:
      // should never happen
      return 0;
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
    case Position.Top:
      return 19;
    default:
      // should never happen
      return 0;
  }
};

const getTgtLabelPositionX = (targetPosition: Position, targetX: number) => {
  if (targetPosition === Position.Left || targetPosition === Position.Bottom) {
    return targetX - 15;
  }
  if (targetPosition === Position.Right || targetPosition === Position.Top) {
    return targetX + 15;
  }
  return targetX;
};

const getTgtLabelPositionY = (targetPosition: Position, targetY: number) => {
  if (targetPosition === Position.Bottom) {
    return targetY + 40;
  }
  return targetY;
};

export {
  getDiamondRefX,
  getDiamondRefY,
  getMarkerRotation,
  getTgtLabelPositionX,
  getTgtLabelPositionY,
};
