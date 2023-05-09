import { DiagramModel } from '../models/diagram.model';

const findDiagramById = async (id: string) => {
  const idRegex = /^\d{4}$/;
  if (!idRegex.test(id)) throw new Error('Invalid Diagram id');
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  return { id: diagram._id };
};

// const createDiagram = async () => {
//   const diagram = await DiagramModel.create({ _id: 1000 });
//   return { id: diagram?._id };
// };

// eslint-disable-next-line import/prefer-default-export
export { findDiagramById };
