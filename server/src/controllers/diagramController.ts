import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { RelationshipModel } from '../models/relationship.model';
import { UserModel } from '../models/user.model';
import {
  reformatClass,
  reformatEnum,
  reformatInterface,
} from './entityServices';
import { reformatRelationship } from './relationshipService';

/** Get all diagrams for a userId
 * @param userId of the user to get diagrams for
 * @returns all diagrams for the user
 */
const getDiagramsForUser = async (userId: string) => {
  const diagrams = await DiagramModel.find({ userId });
  return diagrams.map((d) => ({ id: d._id }));
};

/**
 * Retrieves a diagram by id
 * @param id of the diagram to retrieve
 * @returns the diagram
 */
const findDiagramById = async (id: string) => {
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

  const relationships = await RelationshipModel.find({ diagramId: diagram.id });

  return {
    diagramId: diagram.id,
    entities: [...classes, ...interfaces, ...enums],
    relationships: relationships.map((r) => reformatRelationship(r)),
  };
};

/**
 * Get the contents of a public diagram. Errors if diagram is private
 * @param id of diagram to get
 * @returns the entities and relationships of the diagram
 */
const getDiagramContentsPublic = async (id: string) => {
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  if (!diagram.isPublic) throw new Error('Diagram is private');

  return getDiagramContents(id);
};

/**
 * Creates a diagram
 * @param userId of the user creating the diagram
 * @returns the created diagram
 * @throws an error if the password is invalid
 * @throws an error if the diagram could not be created
 */
const createDiagram = async (userId: string) => {
  if (!userId) throw new Error('Invalid user id');
  const user = UserModel.findById(userId);
  if (!user) throw new Error('User not found');

  const diagram = new DiagramModel({
    isPublic: false,
    userId,
  });
  await diagram.save();
  return diagram;
};

const renameDiagram = async (id: string, name: string) => {
  if (!name) throw new Error('Invalid name');
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  diagram.name = name;
  await diagram.save();
};

/**
 * @param id of the diagram to retrieve
 * @returns true if the diagram is public, false if it is private
 */
const getDiagramPrivacy = async (id: string) => {
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  return diagram.isPublic;
};

const setDiagramPrivacy = async (id: string, isPublic: boolean) => {
  if (isPublic === undefined) throw new Error('Invalid privacy value');
  await DiagramModel.findByIdAndUpdate(id, { isPublic });
};

export {
  createDiagram,
  findDiagramById,
  getDiagramContents,
  getDiagramContentsPublic,
  getDiagramPrivacy,
  getDiagramsForUser,
  renameDiagram,
  setDiagramPrivacy,
};
