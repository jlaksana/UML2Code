import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import { reformatClass, validateEntity } from './entityServices';

const createClass = async (data: unknown, diagramId: string) => {
  const validatedData = await validateEntity(data, diagramId);

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

// eslint-disable-next-line import/prefer-default-export
export { createClass };
