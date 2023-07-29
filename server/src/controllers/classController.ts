import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import {
  reformatClass,
  validateDuplicateEntity,
  validateEntity,
} from './entityServices';

const createClass = async (data: unknown, diagramId: string) => {
  const validatedData = await validateEntity(data, diagramId);
  await validateDuplicateEntity(validatedData.name, diagramId, null);

  try {
    // create a new entity while removing whitespace from all names
    const entity = new EntityModel({
      diagramId,
      type: 'class',
      data: {
        name: removeWhitespace(validatedData.name),
        isAbstract: validatedData.isAbstract || false,
        constants: validatedData.constants?.map((constant) => ({
          ...constant,
          name: removeWhitespace(constant.name),
        })),
        attributes: validatedData.attributes?.map((attribute) => ({
          ...attribute,
          name: removeWhitespace(attribute.name),
        })),
        methods: validatedData.methods?.map((method) => ({
          ...method,
          name: removeWhitespace(method.name),
        })),
      },
    });
    await entity.save();

    return reformatClass(entity);
  } catch (e) {
    // could not create a class in database
    console.log(e);
    throw new Error('Could not create a class');
  }
};

const editClass = async (classId: string, diagramId: string, data: unknown) => {
  const validatedData = await validateEntity(data, diagramId);
  await validateDuplicateEntity(validatedData.name, diagramId, classId);

  try {
    const klass = await EntityModel.findByIdAndUpdate(
      classId,
      {
        data: validatedData,
      },
      { new: true }
    );
    if (!klass) {
      throw new Error();
    }
    return reformatClass(klass);
  } catch (e) {
    throw new Error(`Could not update a class with the given id: ${classId}`);
  }
};

const deleteClass = async (classId: string) => {
  try {
    const klass = await EntityModel.findByIdAndDelete(classId);
    if (!klass) {
      throw new Error();
    }
  } catch (e) {
    throw new Error(`Could not delete a class with the given id: ${classId}`);
  }
};

const updatePosition = async (
  entityId: string,
  position: { x: number; y: number }
) => {
  try {
    const entity = await EntityModel.findByIdAndUpdate(entityId, {
      position,
    });
    if (!entity) {
      throw new Error();
    }
  } catch (e) {
    throw new Error(
      `Could not update an entity position with the given id: ${entityId}`
    );
  }
};

export { createClass, deleteClass, editClass, updatePosition };
