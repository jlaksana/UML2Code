import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import Diagram from '../models/diagram';
import Entity from '../models/entity';
import Relationship from '../models/relationship';

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

  const diagram = new Diagram({ _id: 1000 });
  await diagram.save();
  testDiagramId = diagram._id;

  // Create test entities
  const testEntity1 = await Entity.create({
    variant: 'class',
    name: 'TestClass',
    x: 0,
    y: 0,
    diagramId: testDiagramId.toString(),
    attributes: [],
    methods: [],
  });
  testEntity1Id = testEntity1._id;

  const testEntity2 = await Entity.create({
    variant: 'class',
    name: 'TestAnotherClass',
    x: 0,
    y: 0,
    diagramId: testDiagramId.toString(),
    attributes: [],
    methods: [],
  });
  testEntity2Id = testEntity2._id;
});

afterAll(async () => {
  // clear all test data after all tests
  await Entity.deleteMany({});
  await Diagram.deleteMany({});
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Relationship.deleteMany({});
});

describe('Relationship Schema', () => {
  it('should create a relationship', async () => {
    const testRelationship = new Relationship({
      variant: 'association',
      diagramId: testDiagramId,
      src: testEntity1Id,
      src_name: 'testSrcName',
      src_multi: 'testSrcMulti',
      tar: testEntity2Id,
      tar_name: 'testTarName',
      tar_multi: 'testTarMulti',
    });
    await testRelationship.save();

    expect(testRelationship).not.toBeNull();
    expect(testRelationship.variant).toBe('association');
    expect(testRelationship.diagramId).toBe(testDiagramId);
    expect(testRelationship.src).toEqual(testEntity1Id);
    expect(testRelationship.src_name).toBe('testSrcName');
    expect(testRelationship.src_multi).toBe('testSrcMulti');
    expect(testRelationship.tar).toEqual(testEntity2Id);
    expect(testRelationship.tar_name).toBe('testTarName');
    expect(testRelationship.tar_multi).toBe('testTarMulti');
  });

  it('should not create a relationship with a non-existent diagramId', async () => {
    const testRelationship = new Relationship({
      variant: 'association',
      diagramId: 4040,
      src: testEntity1Id,
      src_name: 'testSrcName',
      src_multi: 'testSrcMulti',
      tar: testEntity2Id,
      tar_name: 'testTarName',
      tar_multi: 'testTarMulti',
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a non-existent src entity', async () => {
    const testRelationship = new Relationship({
      variant: 'inheritance',
      diagramId: testDiagramId,
      src: new mongoose.Types.ObjectId(),
      src_name: 'testSrcName',
      src_multi: 'testSrcMulti',
      tar: testEntity2Id,
      tar_name: 'testTarName',
      tar_multi: 'testTarMulti',
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a non-existent tar entity', async () => {
    const testRelationship = new Relationship({
      variant: 'inheritance',
      diagramId: testDiagramId,
      src: testEntity1Id,
      src_name: 'testSrcName',
      src_multi: 'testSrcMulti',
      tar: new mongoose.Types.ObjectId(),
      tar_name: 'testTarName',
      tar_multi: 'testTarMulti',
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });

  it('should not create a relationship with a invalid variant', async () => {
    const testRelationship = new Relationship({
      variant: 'invalid',
      diagramId: testDiagramId,
      src: testEntity1Id,
      src_name: 'testSrcName',
      src_multi: 'testSrcMulti',
      tar: testEntity2Id,
      tar_name: 'testTarName',
      tar_multi: 'testTarMulti',
    });

    await expect(testRelationship.save()).rejects.toThrow();
  });
});
