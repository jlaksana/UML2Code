/* eslint-disable no-underscore-dangle */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { DiagramModel } from '../src/models/diagram.model';

describe('Diagram Schema', () => {
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

  afterEach(async () => {
    await DiagramModel.deleteMany({});
  });

  it('should be able to save a valid diagram', async () => {
    const diagram1 = new DiagramModel({
      _id: 1234,
    });
    const savedDiagram1 = await diagram1.save();
    expect(savedDiagram1._id).toEqual(diagram1._id);
    expect(savedDiagram1.createdAt).not.toBeUndefined();
    expect(savedDiagram1.updatedAt).not.toBeUndefined();

    const diagram2 = new DiagramModel({
      _id: '1235',
    });
    const savedDiagram2 = await diagram2.save();
    expect(savedDiagram2._id).toEqual(1235);
    expect(savedDiagram2.createdAt).not.toBeUndefined();
  });

  it('should not save a diagram with an invalid id', async () => {
    const diagram = new DiagramModel({
      _id: 999,
    });
    await expect(diagram.save()).rejects.toThrow();
  });

  it('should not save a diagram with a duplicate id', async () => {
    const diagram1 = new DiagramModel({
      _id: 1234,
    });
    await diagram1.save();
    const diagram2 = new DiagramModel({
      _id: 1234,
    });
    await expect(diagram2.save()).rejects.toThrow();
  });

  it('should not save a diagram without an id', async () => {
    const diagram = new DiagramModel({});
    await expect(diagram.save()).rejects.toThrow();
  });
});
