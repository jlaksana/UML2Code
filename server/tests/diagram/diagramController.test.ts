import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import {
  createDiagram,
  findDiagramById,
} from '../../src/controllers/diagramController';
import { CounterModel, DiagramModel } from '../../src/models/diagram.model';

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
    const diagram = await createDiagram();
    expect(diagram).not.toBeNull();
    expect(diagram.id).toEqual(1000);
    const createdDiagram = await DiagramModel.findById(diagram.id);
    expect(createdDiagram).not.toBeNull();

    let counter = await CounterModel.findById('diagramId');
    expect(counter).not.toBeNull();
    expect(counter?.seq).toEqual(1000);

    const diagram2 = await createDiagram();
    expect(diagram2).not.toBeNull();
    expect(diagram2.id).toEqual(1001);
    const createdDiagram2 = await DiagramModel.findById(diagram2.id);
    expect(createdDiagram2).not.toBeNull();

    counter = await CounterModel.findById('diagramId');
    expect(counter).not.toBeNull();
    expect(counter?.seq).toEqual(1001);
  });
});

describe('findDiagramById', () => {
  beforeAll(async () => {
    await createDiagram();
  });

  it('should be able to find a valid diagram', async () => {
    await createDiagram();
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
