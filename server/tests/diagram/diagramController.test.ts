import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { findDiagramById } from '../../src/controllers/diagramController';
import { DiagramModel } from '../../src/models/diagram.model';

describe('findDiagramById', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // create a new in-memory database before running any tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    // create a diagram
    const diagram = new DiagramModel({
      _id: 1000,
    });
    await diagram.save();
  });

  afterAll(async () => {
    // clear all test data after all tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should be able to find a valid diagram', async () => {
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
