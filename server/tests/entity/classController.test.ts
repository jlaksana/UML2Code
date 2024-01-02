import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import {
  createClass,
  deleteEntity,
  editClass,
  updatePosition,
} from '../../src/controllers/classController';
import { createDiagram } from '../../src/controllers/diagramController';
import { createRelationship } from '../../src/controllers/relationshipController';
import { Entity, EntityModel } from '../../src/models/entity.model';
import { RelationshipModel } from '../../src/models/relationship.model';
import { UserModel } from '../../src/models/user.model';

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

  const user = await UserModel.create({
    username: 'test',
    email: 'test@email.com',
    password: 'password',
  });
  // create a diagram to be used in tests
  const diagram = await createDiagram(user._id);
  diagramId = diagram._id;
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
      'Invalid - Ensure all fields are present and valid'
    );
  });

  it('should not be able to create a class with an empty name', async () => {
    const data = {
      name: '',
      isAbstract: false,
    };

    expect(createClass(data, diagramId)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid'
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
});

describe('editClass', () => {
  let klass: Entity;
  beforeEach(async () => {
    // test data
    const data = {
      name: 'Circle',
      isAbstract: false,
    };

    klass = await createClass(data, diagramId);
  });

  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to edit a class', async () => {
    const data = {
      name: 'Square',
      isAbstract: true,
    };

    const updatedClass = await editClass(klass.id, diagramId, data);
    expect(updatedClass).not.toBeNull();
    expect(updatedClass.id).toEqual(klass.id);
    expect(updatedClass.data.name).toEqual('Square');
    expect(updatedClass.data.isAbstract).toEqual(true);
    expect(updatedClass.data.constants).toEqual([]);
    expect(updatedClass.data.attributes).toEqual([]);
    expect(updatedClass.data.methods).toEqual([]);
    expect(updatedClass).not.toHaveProperty('diagramId');
    expect(updatedClass).not.toHaveProperty('_id');
    expect(updatedClass).not.toHaveProperty('__v');
  });

  it('should not be able to edit a class with an empty name', async () => {
    const data = {
      name: '',
      isAbstract: false,
    };

    expect(editClass(klass.id, diagramId, data)).rejects.toThrow(
      'Invalid - Ensure all fields are present and valid'
    );
  });

  it('should not be able to edit a class without a valid diagramId', async () => {
    const data = {
      name: 'Square',
      isAbstract: false,
    };

    expect(editClass(klass.id, '999', data)).rejects.toThrow(
      'Could not find a diagram with the given id: 999'
    );
  });

  it('should be able to add a method to a class', async () => {
    const data = {
      name: 'Circle',
      isAbstract: false,
      methods: [
        {
          id: 1,
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
      ],
    };

    const updatedClass = await editClass(klass.id, diagramId, data);
    expect(updatedClass).not.toBeNull();
    expect(updatedClass.id).toEqual(klass.id);
    expect(updatedClass.data.name).toEqual('Circle');
    expect(updatedClass.data.isAbstract).toEqual(false);
    expect(updatedClass.data.constants).toEqual([]);
    expect(updatedClass.data.attributes).toEqual([]);
    expect(updatedClass.data.methods).toEqual(data.methods);
  });
});

describe('deleteEntity', () => {
  let klass: Entity;
  beforeEach(async () => {
    // test data
    const data = {
      name: 'Circle',
      isAbstract: false,
    };

    klass = await createClass(data, diagramId);
  });

  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to delete a class', async () => {
    await deleteEntity(klass.id, diagramId);
    const deletedClass = await EntityModel.findById(klass.id);
    expect(deletedClass).toBeNull();
  });

  it('should not be able to delete a class with an invalid id', async () => {
    expect(deleteEntity('invalid', diagramId)).rejects.toThrow(
      'Could not delete entity with the given id: invalid'
    );
  });

  it('should delete all relationships associated with a class', async () => {
    // create a relationship
    const data = {
      name: 'Square',
      isAbstract: false,
    };
    const square = await createClass(data, diagramId);
    const relationship1 = await createRelationship(
      {
        type: 'Association',
        source: 'Circle',
        target: 'Square',
        srcMultiplicity: '1',
        tgtMultiplicity: '1',
      },
      diagramId
    );
    const relationship2 = await createRelationship(
      {
        type: 'Association',
        source: 'Square',
        target: 'Circle',
        srcMultiplicity: '1',
        tgtMultiplicity: '1',
      },
      diagramId
    );

    await deleteEntity(square.id, diagramId);
    expect(await RelationshipModel.findById(relationship1.id)).toBeNull();
    expect(await RelationshipModel.findById(relationship2.id)).toBeNull();
  });
});

describe('updatePosition', () => {
  let klass: Entity;
  beforeEach(async () => {
    // test data
    const data = {
      name: 'Square',
      isAbstract: false,
    };

    klass = await createClass(data, diagramId);
  });

  afterEach(async () => {
    await EntityModel.deleteMany({});
  });

  it('should be able to update the position of a class', async () => {
    const position = { x: 100, y: 200 };
    await updatePosition(klass.id, diagramId, position);
    const updatedClass = await EntityModel.findById(klass.id);
    expect(updatedClass).not.toBeNull();
    expect(updatedClass?.position).toEqual(position);
  });

  it('should not be able to update the position of a class with an invalid id', async () => {
    const position = { x: 100, y: 200 };
    expect(updatePosition('invalid', diagramId, position)).rejects.toThrow(
      'Could not update an entity position with the given id: invalid'
    );
  });
});
