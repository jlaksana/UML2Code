import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { createDiagram } from '../../src/controllers/diagramController';
import {
  createInterface,
  editInterface,
} from '../../src/controllers/interfaceController';
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

describe('createInterface', () => {
  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to create a valid interface', async () => {
    const data = {
      name: 'Shape',
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
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
      ],
    };

    const createdInterface = await createInterface(data, diagramId);
    expect(createdInterface).not.toBeNull();
    expect(createdInterface.data.name).toBe('Shape');
    expect(createdInterface.data.constants).toEqual(data.constants);
    expect(createdInterface.data.methods).toEqual(data.methods);
    expect(createdInterface.data.attributes).toBeUndefined();
  });

  it('should not create an interface with an empty name', async () => {
    const data = {
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
      ],
    };

    await expect(createInterface(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid'
    );
  });

  it('should not create an interface with attributes', async () => {
    const data = {
      name: 'Shape',
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
      ],
      methods: [
        {
          id: 1,
          name: 'getXPos',
          returnType: 'int',
        },
        {
          id: 2,
          name: 'getYPos',
          returnType: 'int',
        },
      ],
      attributes: [{ id: 1, name: 'xPos', type: 'int', visibility: '—' }],
    };

    await expect(createInterface(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid'
    );
  });

  it('should not create an interface without a valid diagram id', async () => {
    const data = {
      name: 'Shape',
    };

    await expect(createInterface(data, '999')).rejects.toThrow(
      'Could not find a diagram with the given id: 999'
    );
  });

  it('should not create an interface with an invalid diagram id', async () => {
    const data = {
      name: 'Shape',
    };

    await expect(createInterface(data, 'invalidId')).rejects.toThrow(
      'Could not find a diagram with the given id: invalidId'
    );
  });

  it('should not create with a duplicate name', async () => {
    const data = {
      name: 'Shape',
    };

    await createInterface(data, diagramId);
    await expect(createInterface(data, diagramId)).rejects.toThrow(
      'An entity with the name "Shape" already exists in the diagram'
    );
  });
});

describe('editInterface', () => {
  let interfaceId: string;

  beforeEach(async () => {
    const data = {
      name: 'Shape',
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
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
      ],
    };

    const createdInterface = await createInterface(data, diagramId);
    interfaceId = createdInterface.id;
  });

  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to edit an interface', async () => {
    const data = {
      name: 'Shape',
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
        { id: 3, name: 'G', type: 'double' },
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
          name: 'setXPos',
          returnType: 'void',
          visibility: '+',
          isStatic: false,
        },
      ],
    };

    const editedInterface = await editInterface(interfaceId, diagramId, data);
    expect(editedInterface).not.toBeNull();
    expect(editedInterface.data.name).toBe('Shape');
    expect(editedInterface.data.constants).toEqual(data.constants);
    expect(editedInterface.data.methods).toEqual(data.methods);
    expect(editedInterface.data.attributes).toBeUndefined();
  });

  it('should not edit an interface with an empty name', async () => {
    const data = {
      name: '',
      constants: [
        { id: 1, name: 'PI', type: 'double' },
        { id: 2, name: 'E', type: 'double' },
      ],
    };

    await expect(editInterface(interfaceId, diagramId, data)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid'
    );
  });

  it('should not edit an interface without a valid diagram id', async () => {
    const data = {
      name: 'Shape',
    };

    await expect(editInterface(interfaceId, '999', data)).rejects.toThrow(
      'Could not find a diagram with the given id: 999'
    );
  });
});
