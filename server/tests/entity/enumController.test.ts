import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { createDiagram } from '../../src/controllers/diagramController';
import { createEnum } from '../../src/controllers/enumController';
import { EntityModel } from '../../src/models/entity.model';

let mongoServer: MongoMemoryServer;
let diagramId: string;

beforeAll(async () => {
  // create a new in-memory database before running any tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  // create a diagram to be used in tests
  const diagram = await createDiagram();
  diagramId = diagram.id;
});

afterAll(async () => {
  // clear all test data after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('createEnum', () => {
  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to create a valid enum', async () => {
    const data = {
      name: 'Color enum',
      values: [
        { id: 1, name: 'Red' },
        { id: 2, name: 'blue' },
      ],
    };
    const entity = await createEnum(data, diagramId);
    expect(entity).toBeDefined();
    expect(entity.id).toBeDefined();
    expect(entity.type).toBe('enum');
    expect(entity.data.name).toBe('Colorenum');
    expect(entity.data.constants).toBeUndefined();
    expect(entity.data.methods).toBeUndefined();
  });

  it('should throw an error if the diagram id is invalid', async () => {
    const data = {
      name: 'Shape',
      values: [
        { id: 1, name: 'PI' },
        { id: 2, name: 'E' },
      ],
    };
    await expect(createEnum(data, 'invalidId')).rejects.toThrow(
      'Could not find a diagram with the given id: invalidId'
    );
  });

  it('should throw an error if the enum name is empty', async () => {
    const data = {
      name: '',
      values: [
        { id: 1, name: 'PI' },
        { id: 2, name: 'E' },
      ],
    };
    await expect(createEnum(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid. Must have at least one value'
    );
  });

  it('should throw an error if the enum name is not unique', async () => {
    const data = {
      name: 'Shape',
      values: [
        { id: 1, name: 'PI' },
        { id: 2, name: 'E' },
      ],
    };
    await createEnum(data, diagramId);
    await expect(createEnum(data, diagramId)).rejects.toThrow();
  });

  it('should throw an error if the enum values are empty', async () => {
    const data = {
      name: 'Shape',
      values: [],
    };
    await expect(createEnum(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid. Must have at least one value'
    );
  });

  it('should throw an error if the enum values is undefined', async () => {
    const data = {
      name: 'Shape',
    };
    await expect(createEnum(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid. Must have at least one value'
    );
  });
});
