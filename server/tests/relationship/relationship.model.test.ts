import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { DiagramModel } from '../../src/models/diagram.model';
import { EntityModel } from '../../src/models/entity.model';
import { RelationshipModel } from '../../src/models/relationship.model';

let mongoServer: MongoMemoryServer;
let testDiagramId: number;
let testEntity1Id: mongoose.Types.ObjectId;
let testEntity2Id: mongoose.Types.ObjectId;

beforeAll(async () => {
  // create a new in-memory database before running any tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  const diagram = new DiagramModel({ _id: 1000, password: 'password' });
  await diagram.save();
  testDiagramId = diagram._id;

  // Create test entities
  const testEntity1 = await EntityModel.create({
    diagramId: testDiagramId.toString(),
    type: 'class',
    position: { x: 10, y: 20 },
    data: {
      name: 'TestClass',
    },
  });
  testEntity1Id = testEntity1._id;

  const testEntity2 = await EntityModel.create({
    diagramId: testDiagramId.toString(),
    type: 'class',
    position: { x: 10, y: 20 },
    data: {
      name: 'AnotherTestClass',
    },
  });
  testEntity2Id = testEntity2._id;
});

afterEach(async () => {
  await RelationshipModel.deleteMany({});
});

afterAll(async () => {
  // clear all test data after all tests
  await EntityModel.deleteMany({});
  await DiagramModel.deleteMany({});
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Relationship Schema', () => {
  it('should create a relationship', async () => {
    const testRelationship = new RelationshipModel({
      type: 'Association',
      diagramId: testDiagramId,
      source: testEntity1Id,
      target: testEntity2Id,
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });
    await testRelationship.save();

    expect(testRelationship).toMatchObject({
      type: 'Association',
      diagramId: testDiagramId,
      source: testEntity1Id,
      target: testEntity2Id,
      sourceHandle: 'bottom-middle',
      targetHandle: 'top-middle',
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });
  });

  it('should not create a relationship with a non-existent diagramId', async () => {
    const testRelationship = new RelationshipModel({
      type: 'Association',
      diagramId: 9000000,
      source: testEntity1Id,
      target: testEntity2Id,
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a non-existent src entity', async () => {
    const testRelationship = new RelationshipModel({
      type: 'Association',
      diagramId: testDiagramId,
      source: new mongoose.Types.ObjectId(),
      target: testEntity2Id,
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a non-existent tar entity', async () => {
    const testRelationship = new RelationshipModel({
      type: 'Association',
      diagramId: testDiagramId,
      source: testEntity1Id,
      target: new mongoose.Types.ObjectId(),
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a invalid variant', async () => {
    const testRelationship = new RelationshipModel({
      type: 'invalid',
      diagramId: testDiagramId,
      source: testEntity1Id,
      target: testEntity2Id,
      data: {
        label: 'testLabel',
        srcMultiplicity: '*',
        tgtMultiplicity: '1..*',
      },
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });
});
