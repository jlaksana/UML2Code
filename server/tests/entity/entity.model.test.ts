import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { Diagram, DiagramModel } from '../../src/models/diagram.model';
import { EntityModel } from '../../src/models/entity.model';
import { UserModel } from '../../src/models/user.model';

describe('Entity Schema', () => {
  let mongoServer: MongoMemoryServer;
  let diagram: Diagram;

  beforeAll(async () => {
    // create a new in-memory database before running any tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    const user = await UserModel.create({
      username: 'test',
      email: 'email@email.com',
      password: 'password',
    });
    diagram = new DiagramModel({ userId: user._id });
    await diagram.save();
  });

  afterAll(async () => {
    // clear all test data after all tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should create a new entity', async () => {
    const entity = new EntityModel({
      diagramId: diagram._id,
      type: 'class',
      position: { x: 10, y: 20 },
      data: {
        name: 'TestClass',
        isAbstract: false,
        constants: [],
        attributes: [],
        methods: [],
      },
    });
    await expect(entity.save()).resolves.not.toThrow();

    const found = await EntityModel.findOne({ _id: entity._id });
    expect(found).not.toBeNull();
    expect(found?.type).toBe('class');
    expect(found?.position.x).toBe(10);
    expect(found?.position.y).toBe(20);
    expect(found?.data.name).toBe('TestClass');
    expect(found?.data.isAbstract).toBe(false);
    expect(found?.data.constants).toHaveLength(0);
    expect(found?.data.attributes).toHaveLength(0);
    expect(found?.data.methods).toHaveLength(0);
  });

  it('should not allow entities with invalid variants', async () => {
    const entity = new EntityModel({
      diagramId: diagram._id,
      type: 'invalid',
      position: { x: 10, y: 20 },
      data: {
        name: 'TestClass',
        isAbstract: false,
      },
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow entities without an existing diagram', async () => {
    const entity = new EntityModel({
      diagramId: 9999,
      type: 'class',
      position: { x: 10, y: 20 },
      data: {
        name: 'TestClass',
      },
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow constants with invalid types', async () => {
    const entity = new EntityModel({
      diagramId: diagram._id,
      type: 'class',
      position: { x: 10, y: 20 },
      data: {
        name: 'TestClass',
        constants: [
          {
            name: 'testConst',
            type: 'invalid',
          },
        ],
      },
    });
    await expect(entity.save()).rejects.toThrow();
  });

  it('should not allow attributes with invalid types', async () => {
    const entity = new EntityModel({
      diagramId: diagram._id,
      type: 'class',
      position: { x: 10, y: 20 },
      data: {
        name: 'TestClass',
        attributes: [
          {
            name: 'testAttr',
            visibility: '+',
            type: 'invalid',
            isConstant: false,
          },
        ],
      },
    });
    await expect(entity.save()).rejects.toThrow();
  });
});
