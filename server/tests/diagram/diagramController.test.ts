import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { createClass } from '../../src/controllers/classController';
import {
  createDiagram,
  findDiagramById,
  getDiagramContents,
} from '../../src/controllers/diagramController';
import { createEnum } from '../../src/controllers/enumController';
import { createInterface } from '../../src/controllers/interfaceController';
import { createRelationship } from '../../src/controllers/relationshipController';
import { CounterModel, DiagramModel } from '../../src/models/diagram.model';
import { EntityModel } from '../../src/models/entity.model';
import { RelationshipModel } from '../../src/models/relationship.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // create a new in-memory database before running any tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
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
    await CounterModel.deleteMany({});
  });

  it('should be able to create a diagram', async () => {
    const diagram = await createDiagram('password');
    expect(diagram).not.toBeNull();
    expect(diagram.id).toEqual('1000');
    const createdDiagram = await DiagramModel.findById(diagram.id);
    expect(createdDiagram).not.toBeNull();

    let counter = await CounterModel.findById('diagramId');
    expect(counter).not.toBeNull();
    expect(counter?.seq).toEqual(1000);

    const diagram2 = await createDiagram('password');
    expect(diagram2).not.toBeNull();
    expect(diagram2.id).toEqual('1001');
    const createdDiagram2 = await DiagramModel.findById(diagram2.id);
    expect(createdDiagram2).not.toBeNull();

    counter = await CounterModel.findById('diagramId');
    expect(counter).not.toBeNull();
    expect(counter?.seq).toEqual(1001);
  });
});

describe('findDiagramById', () => {
  beforeAll(async () => {
    await createDiagram('password');
  });

  it('should be able to find a valid diagram', async () => {
    await createDiagram('password');
    const diagram = await findDiagramById('1000');
    expect(diagram).not.toBeNull();
    expect(diagram.id).toEqual(1000);
  });

  it('should not find a diagram with an invalid id', async () => {
    expect(findDiagramById('999')).rejects.toThrow('Invalid Diagram id');
  });

  it('should not find a diagram with a non-existent id', async () => {
    expect(findDiagramById('9999')).rejects.toThrow('Diagram not found');
  });
});

describe('getDiagramContents', () => {
  beforeEach(async () => {
    await createDiagram('password');
  });

  afterEach(async () => {
    await DiagramModel.deleteMany({});
    await CounterModel.deleteMany({});
    await EntityModel.deleteMany({});
    await RelationshipModel.deleteMany({});
  });

  it('should be able to get the contents of a diagram', async () => {
    const contents = await getDiagramContents('1000');
    expect(contents).not.toBeNull();
    expect(contents.diagramId).toEqual(1000);
    expect(contents.entities).not.toBeNull();
    expect(contents.entities).not.toBeNull();
    expect(contents.entities.length).toEqual(0);
    expect(contents.relationships).not.toBeNull();
    expect(contents.relationships.length).toEqual(0);
  });

  it('should not get the contents of a diagram with an invalid id', async () => {
    expect(getDiagramContents('999')).rejects.toThrow('Invalid Diagram id');
  });

  it('should not get the contents of a diagram with a non-existent id', async () => {
    expect(getDiagramContents('9999')).rejects.toThrow('Diagram not found');
  });

  it('should be able to get the contents of a diagram with entities', async () => {
    const testClass = {
      name: 'classtest',
      isAbstract: false,
      constants: [],
      attributes: [],
      methods: [],
    };
    await createClass(testClass, '1000');
    const testInterface = { name: 'interfacetest', constants: [], methods: [] };
    await createInterface(testInterface, '1000');
    const testEnum = {
      name: 'Colorenum',
      values: [
        { id: 1, name: 'RED' },
        { id: 2, name: 'BLUE' },
      ],
    };
    await createEnum(testEnum, '1000');

    const contents = await getDiagramContents('1000');
    expect(contents).not.toBeNull();
    expect(contents.diagramId).toEqual(1000);
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
    await createClass(testClass, '1000');
    const testInterface = { name: 'interfacetest', constants: [], methods: [] };
    await createInterface(testInterface, '1000');
    const testRelationship = {
      type: 'Association',
      source: 'classtest',
      target: 'interfacetest',
      label: 'test',
      srcMultiplicity: '1',
      tgtMultiplicity: '1',
    };
    await createRelationship(testRelationship, '1000');

    const contents = await getDiagramContents('1000');
    expect(contents).not.toBeNull();
    expect(contents.diagramId).toEqual(1000);
    expect(contents.relationships).not.toBeNull();
    expect(contents.relationships.length).toEqual(1);
  });
});
