import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { createClass } from '../../src/controllers/classController';
import {
  createDiagram,
  deleteDiagram,
  getDiagramContents,
  getDiagramPrivacy,
  renameDiagram,
  setDiagramPrivacy,
} from '../../src/controllers/diagramController';
import { createEnum } from '../../src/controllers/enumController';
import { createInterface } from '../../src/controllers/interfaceController';
import { createRelationship } from '../../src/controllers/relationshipController';
import { DiagramModel } from '../../src/models/diagram.model';
import { EntityModel } from '../../src/models/entity.model';
import { RelationshipModel } from '../../src/models/relationship.model';
import { UserModel } from '../../src/models/user.model';

let mongoServer: MongoMemoryServer;
let userId: string;

beforeAll(async () => {
  // create a new in-memory database before running any tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  // create a user to be used in tests
  const user = await UserModel.create({
    username: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  userId = user._id;
});

afterAll(async () => {
  // clear all test data after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('createDiagram', () => {
  afterAll(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to create a diagram for user', async () => {
    const diagram = await createDiagram(userId);
    expect(diagram).not.toBeNull();
  });
});

describe('getDiagramContents', () => {
  let diagramId: string;
  beforeEach(async () => {
    const diagram = await createDiagram(userId);
    diagramId = diagram._id;
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
    await EntityModel.deleteMany({});
    await RelationshipModel.deleteMany({});
  });

  it('should be able to get the contents of a diagram', async () => {
    const contents = await getDiagramContents(diagramId);
    expect(contents).not.toBeNull();
    expect(contents.entities).not.toBeNull();
    expect(contents.entities).not.toBeNull();
    expect(contents.entities.length).toEqual(0);
    expect(contents.relationships).not.toBeNull();
    expect(contents.relationships.length).toEqual(0);
  });

  it('should not get the contents of a diagram with a non-existent id', async () => {
    expect(getDiagramContents('not an id')).rejects.toThrow(
      'Diagram not found'
    );
  });

  it('should be able to get the contents of a diagram with entities', async () => {
    const testClass = {
      name: 'classtest',
      isAbstract: false,
      constants: [],
      attributes: [],
      methods: [],
    };
    await createClass(testClass, diagramId);
    const testInterface = { name: 'interfacetest', constants: [], methods: [] };
    await createInterface(testInterface, diagramId);
    const testEnum = {
      name: 'Colorenum',
      values: [
        { id: 1, name: 'RED' },
        { id: 2, name: 'BLUE' },
      ],
    };
    await createEnum(testEnum, diagramId);

    const contents = await getDiagramContents(diagramId);
    expect(contents).not.toBeNull();
    expect(contents.entities).not.toBeNull();
    expect(contents.entities.length).toEqual(3);
  });

  it('should be able to get the contents of a diagram with relationships', async () => {
    const testClass = {
      name: 'classtest',
      isAbstract: false,
      constants: [],
      attributes: [],
      methods: [],
    };
    await createClass(testClass, diagramId);
    const testInterface = { name: 'interfacetest', constants: [], methods: [] };
    await createInterface(testInterface, diagramId);
    const testRelationship = {
      type: 'Association',
      source: 'classtest',
      target: 'interfacetest',
      label: 'test',
      srcMultiplicity: '1',
      tgtMultiplicity: '1',
    };
    await createRelationship(testRelationship, diagramId);

    const contents = await getDiagramContents(diagramId);
    expect(contents).not.toBeNull();
    expect(contents.relationships).not.toBeNull();
    expect(contents.relationships.length).toEqual(1);
  });
});

describe('renameDiagram', () => {
  let diagramId: string;
  beforeEach(async () => {
    const diagram = await createDiagram(userId);
    diagramId = diagram._id;
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to rename a diagram', async () => {
    await renameDiagram(diagramId, 'new name');
    const diagram = await DiagramModel.findById(diagramId);
    expect(diagram).not.toBeNull();
    expect(diagram?.name).toEqual('new name');
  });

  it('should not be able to rename a diagram with a non-existent id', async () => {
    expect(renameDiagram('not an id', 'new name')).rejects.toThrow(
      'Diagram not found'
    );
  });

  it('should not be able to rename a diagram with an invalid name', async () => {
    expect(renameDiagram(diagramId, '')).rejects.toThrow('Invalid name');
  });
});

describe('deleteDiagram', () => {
  let diagramId: string;
  beforeEach(async () => {
    const diagram = await createDiagram(userId);
    diagramId = diagram._id;
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to delete a diagram', async () => {
    await deleteDiagram(diagramId);
    const diagram = await DiagramModel.findById(diagramId);
    expect(diagram).toBeNull();
  });

  it('should not be able to delete a diagram with a non-existent id', async () => {
    expect(deleteDiagram('not an id')).rejects.toThrow('Diagram not found');
  });
});

describe('diagram privacy', () => {
  let diagramId: string;
  beforeEach(async () => {
    const diagram = await createDiagram(userId);
    diagramId = diagram._id;
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to get the privacy of a diagram', async () => {
    const privacy = await getDiagramPrivacy(diagramId);
    expect(privacy).not.toBeNull();
    expect(privacy).toEqual(false);
  });

  it('should be able to set the privacy of a diagram', async () => {
    await setDiagramPrivacy(diagramId, true);
    const privacy = await getDiagramPrivacy(diagramId);
    expect(privacy).not.toBeNull();
    expect(privacy).toEqual(true);
  });

  it('should not be able to set the privacy of a diagram with a non-existent id', async () => {
    expect(setDiagramPrivacy('not an id', true)).rejects.toThrow(
      'Diagram not found'
    );
  });
});

describe('getDiagramsForUser', () => {
  beforeEach(async () => {
    await createDiagram(userId);
    await createDiagram(userId);
    const user2 = await UserModel.create({
      username: 'test2',
      email: 'email2@email.com',
      password: 'password',
    });
    await createDiagram(user2._id);
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to get all diagrams for a user', async () => {
    const diagrams = await DiagramModel.find({ userId });
    expect(diagrams).not.toBeNull();
    expect(diagrams.length).toEqual(2);
  });
});
