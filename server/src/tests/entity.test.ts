import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import Diagram, { IDiagram } from '../models/diagram';
import Entity from '../models/entity';

describe('Entity', () => {
  let mongoServer: MongoMemoryServer;
  let diagram: IDiagram;

  beforeAll(async () => {
    // create a new in-memory database before running any tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  beforeEach(async () => {
    diagram = new Diagram({ _id: 1000 });
    await diagram.save();
  });

  afterAll(async () => {
    // clear all test data after all tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Entity.deleteMany({});
    await Diagram.deleteMany({});
  });

  it('should create a new entity', async () => {
    const entity = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
      attributes: [
        {
          name: 'testAttr',
          visibility: '+',
          type: 'string',
          isConstant: false,
        },
      ],
      methods: [
        {
          name: 'testMethod',
          isStatic: true,
          visibility: '-',
          retType: 'void',
        },
      ],
    });
    await entity.save();
    expect(entity).toHaveProperty('_id');
    expect(entity.variant).toBe('class');
    expect(entity.name).toBe('TestClass');
    expect(entity.x).toBe(10);
    expect(entity.y).toBe(20);
    expect(entity.diagramId).toEqual(diagram._id);
    expect(entity.attributes).toHaveLength(1);
    expect(entity.attributes[0].name).toBe('testAttr');
    expect(entity.attributes[0].visibility).toBe('+');
    expect(entity.attributes[0].type).toBe('string');
    expect(entity.attributes[0].isConstant).toBe(false);
    expect(entity.methods).toHaveLength(1);
    expect(entity.methods[0].name).toBe('testMethod');
    expect(entity.methods[0].isStatic).toBe(true);
    expect(entity.methods[0].visibility).toBe('-');
    expect(entity.methods[0].retType).toBe('void');
  });

  it('should not allow duplicate entities in the same diagram', async () => {
    const entity1 = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
    });
    const entity2 = new Entity({
      variant: 'interface',
      name: 'TestClass',
      x: 20,
      y: 30,
      diagramId: diagram._id,
    });
    await entity1.save();
    await expect(entity2.save()).rejects.toThrow();
  });

  it('should allow same name entities in different diagrams', async () => {
    const diagram2 = new Diagram({ _id: 1001 });
    await diagram2.save();

    const entity1 = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
    });
    const entity2 = new Entity({
      variant: 'interface',
      name: 'TestClass',
      x: 20,
      y: 30,
      diagramId: diagram2._id,
    });
    await entity1.save();
    await expect(entity2.save()).resolves.not.toThrow();
  });

  it('should not allow entities with invalid variants', async () => {
    const entity = new Entity({
      variant: 'invalid',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow entities without an existing diagram', async () => {
    const entity = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: 9999,
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow attributes with invalid types', async () => {
    const entity = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
      attributes: [
        {
          name: 'testAttr',
          visibility: '+',
          type: 'invalid',
          isConstant: false,
        },
      ],
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow attributes with duplicate names', async () => {
    const entity = new Entity({
      variant: 'class',
      name: 'TestClass',
      x: 10,
      y: 20,
      diagramId: diagram._id,
      attributes: [
        {
          name: 'testAttr',
          visibility: '+',
          type: 'string',
          isConstant: false,
        },
        {
          name: 'testAttr',
          visibility: '+',
          type: 'string',
          isConstant: false,
        },
      ],
    });
    await expect(entity.save()).rejects.toThrow();
  });
});
