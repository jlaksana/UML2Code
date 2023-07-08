import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { createClass } from '../../src/controllers/classController';
import { createDiagram } from '../../src/controllers/diagramController';
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

describe('createClass', () => {
  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to create a valid class', async () => {
    const data = {
      name: 'Circle Class',
      isAbstract: false,
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
      ],
      attributes: [
        { id: 1, name: 'xPos', type: 'int', visibility: '—' },
        { id: 2, name: 'yPos', type: 'int', visibility: '—' },
      ],
      methods: [
        {
          id: 1,
          name: 'getXPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 2,
          name: 'getYPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 3,
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: 4,
          name: 'area',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
      ],
    };

    const createdClass = await createClass(data, diagramId);
    expect(createdClass).not.toBeNull();
    expect(createdClass.id).not.toBeNull();
    expect(createdClass.data.name).toEqual('CircleClass');
    expect(createdClass.data.isAbstract).toEqual(data.isAbstract);
    expect(createdClass.data.constants).toEqual(data.constants);
    expect(createdClass.data.attributes).toEqual(data.attributes);
    expect(createdClass.data.methods).toEqual(data.methods);
    expect(createdClass).not.toHaveProperty('diagramId');
    expect(createdClass).not.toHaveProperty('_id');
    expect(createdClass).not.toHaveProperty('__v');
  });

  it('should not be able to create a class without a name', async () => {
    const data = {
      isAbstract: false,
    };

    expect(createClass(data, diagramId)).rejects.toThrow(
      'Invalid class. Ensure all fields are present and valid'
    );
  });

  it('should not be able to create a class with an empty name', async () => {
    const data = {
      name: '',
      isAbstract: false,
    };

    expect(createClass(data, diagramId)).rejects.toThrow(
      'Invalid class. Ensure all fields are present and valid'
    );
  });

  it('should not create a class without a valid diagramId', async () => {
    const data = {
      name: 'Circle',
      isAbstract: false,
    };

    expect(createClass(data, '999')).rejects.toThrow(
      'Could not find a diagram with the given id: 999'
    );
  });

  it('should not create a class without a valid diagramId string', async () => {
    const data = {
      name: 'Circle',
      isAbstract: false,
    };

    expect(createClass(data, 'invalid')).rejects.toThrow(
      'Could not find a diagram with the given id: invalid'
    );
  });

  it('should not create a class with a duplicate name in a diagram', async () => {
    // test data
    const data = {
      name: 'Square',
      isAbstract: false,
    };

    await createClass(data, diagramId);

    expect(createClass(data, diagramId)).rejects.toThrow();
  });
});