import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { getNextSequence } from '../utils';
import {
  reformatClass,
  reformatEnum,
  reformatInterface,
} from './entityServices';

const findDiagramById = async (id: string) => {
  const idRegex = /^\d{4}$/;
  if (!idRegex.test(id)) throw new Error('Invalid Diagram id');
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  return { id: diagram._id };
};

/**
 * Retrieves all entities and relationships of a diagram, and
 * returns them in a format that can be used by the client
 * @param id id of the diagram to retrieve
 * @returns the entities and relationships of the diagram
 */
const getDiagramContents = async (id: string) => {
  const diagram = await findDiagramById(id);
  const entities = await EntityModel.find({ diagramId: diagram.id });

  const classes = entities
    .filter((entity) => entity.type === 'class')
    .map((c) => reformatClass(c));
  const interfaces = entities
    .filter((entity) => entity.type === 'interface')
    .map((i) => reformatInterface(i));
  const enums = entities
    .filter((entity) => entity.type === 'enum')
    .map((e) => reformatEnum(e));

  return {
    diagramId: diagram.id,
    entities: [...classes, ...interfaces, ...enums],
    relationships: [],
  };
};

const createDiagram = async () => {
  const diagram = await DiagramModel.create({ _id: await getNextSequence() });
  return { id: diagram._id };
};

export { createDiagram, findDiagramById, getDiagramContents };
