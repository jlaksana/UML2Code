/* eslint-disable @typescript-eslint/no-explicit-any */
import pick from 'lodash.pick';
import { DiagramModel } from '../models/diagram.model';
import { Entity, EntityModel, entityData } from '../models/entity.model';
import { removeWhitespace } from '../utils';

// validate that the entity name is unique in the diagram
const validateDuplicateEntity = async (
  name: string,
  diagramId: string,
  entityId: string | null
) => {
  const strippedName = removeWhitespace(name);
  let count;
  if (entityId) {
    // if editing an entity, allow the name to be the same as the current name
    count = await EntityModel.countDocuments({
      diagramId,
      'data.name': strippedName,
      _id: { $ne: entityId },
    });
  } else {
    count = await EntityModel.countDocuments({
      diagramId,
      'data.name': strippedName,
    });
  }
  if (count > 0) {
    throw new Error(
      `An entity with the name "${name}" already exists in the diagram`
    );
  }
  return strippedName;
};

// validate data to be a valid entity and diagram id to be an existing diagram
const validateEntity = async (data: unknown, diagramId: string) => {
  const parseResult = entityData.safeParse(data);
  if (!parseResult.success) {
    // incorrect data format
    throw new Error('Invalid - Ensure all fields are present and valid');
  } else {
    // query for the diagram
    try {
      const diagram = await DiagramModel.findById(diagramId);
      if (!diagram) {
        throw new Error();
      }
    } catch (e) {
      throw new Error(
        `Could not find a diagram with the given id: ${diagramId}`
      );
    }
  }

  return parseResult.data;
};

// reformat the entity from the database to expected format for a class
const reformatClass = (entity: Entity) => {
  const reformattedClass: any = entity.toObject();
  // rename _id to id
  reformattedClass.id = reformattedClass._id;

  // remove _id from all subdocuments
  reformattedClass.data = {
    ...reformattedClass.data,
    constants: reformattedClass.data.constants.map((constant: any) =>
      pick(constant, ['id', 'name', 'type'])
    ),
    attributes: reformattedClass.data.attributes.map((attribute: any) =>
      pick(attribute, ['id', 'name', 'type', 'visibility'])
    ),
    methods: reformattedClass.data.methods.map((method: any) =>
      pick(method, ['id', 'name', 'returnType', 'visibility', 'isStatic'])
    ),
  };

  return pick(reformattedClass, ['id', 'type', 'position', 'data']) as Entity;
};

const reformatInterface = (entity: Entity) => {
  const reformattedInterface: any = entity.toObject();
  // rename _id to id
  reformattedInterface.id = reformattedInterface._id;

  // remove _id from all subdocuments
  reformattedInterface.data = {
    name: reformattedInterface.data.name,
    constants: reformattedInterface.data.constants.map((constant: any) =>
      pick(constant, ['id', 'name', 'type'])
    ),
    methods: reformattedInterface.data.methods.map((method: any) =>
      pick(method, ['id', 'name', 'returnType', 'visibility', 'isStatic'])
    ),
  };

  return pick(reformattedInterface, [
    'id',
    'type',
    'position',
    'data',
  ]) as Entity;
};

const reformatEnum = (entity: Entity) => {
  const reformattedEnum: any = entity.toObject();
  // rename _id to id
  reformattedEnum.id = reformattedEnum._id;

  // remove _id from all subdocuments
  reformattedEnum.data = {
    name: reformattedEnum.data.name,
    values: reformattedEnum.data.constants.map((constant: any) =>
      pick(constant, ['id', 'name'])
    ),
  };

  return pick(reformattedEnum, ['id', 'type', 'position', 'data']) as Entity;
};

export {
  reformatClass,
  reformatEnum,
  reformatInterface,
  validateDuplicateEntity,
  validateEntity,
};
