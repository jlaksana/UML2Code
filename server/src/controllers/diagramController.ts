import { DiagramModel } from '../models/diagram.model';
import { getNextSequence } from '../utils';

const findDiagramById = async (id: string) => {
  const idRegex = /^\d{4}$/;
  if (!idRegex.test(id)) throw new Error('Invalid Diagram id');
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  return { id: diagram._id };
};

const createDiagram = async () => {
  const diagram = await DiagramModel.create({ _id: await getNextSequence() });
  return { id: diagram._id };
};

export { findDiagramById, createDiagram };
