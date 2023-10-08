import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { RelationshipModel } from '../models/relationship.model';
import { getNextSequence } from '../utils';
import {
  reformatClass,
  reformatEnum,
  reformatInterface,
} from './entityServices';
import { reformatRelationship } from './relationshipService';

const idRegex = /^\d+$/;

/** Logs in to a diagram
 * @param id id of the diagram to log in to
 * @param password password of the diagram to log in to
 * @returns a JWT token
 */
const loginToDiagram = async (id: string, password: string) => {
  if (!idRegex.test(id)) throw new Error('Invalid Diagram id');

  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');

  if (!password || typeof password !== 'string')
    throw new Error('Invalid password');
  const match = await bcrypt.compare(password, diagram.password);
  if (!match) throw new Error('Invalid password');
  if (process.env.JWT_SECRET === undefined) {
    console.log('JWT secret is undefined');
    throw new Error('Server Error');
  }
  const token = jwt.sign({ diagramId: diagram._id }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  return token;
};

/**
 * Retrieves a diagram by id
 * @param id of the diagram to retrieve
 * @returns the diagram
 */
const findDiagramById = async (id: string) => {
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
  if (!idRegex.test(id)) throw new Error('Invalid Diagram id');
  const diagram = await DiagramModel.findById(id);
  if (!diagram) throw new Error('Diagram not found');
  if (!diagram.isPublic) throw new Error('Diagram is private');

  return getDiagramContents(id);
};

/**
 * Creates a diagram
 * @param password password of the diagram to create
 * @returns the created diagram
 * @throws an error if the password is invalid
 * @throws an error if the diagram could not be created
 */
const createDiagram = async (password: unknown) => {
  if (!password || typeof password !== 'string')
    throw new Error('Invalid password');

  if (password.length < 8)
    throw new Error('Password must be at least 8 characters long');

  // hash the password
  try {
    const hash = await bcrypt.hash(password, 10);
    const diagram = new DiagramModel({
      _id: await getNextSequence(),
      password: hash,
    });
    await diagram.save();
    return diagram;
  } catch (err) {
    throw new Error('Could not create a diagram');
  }
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
  loginToDiagram,
  setDiagramPrivacy,
};
