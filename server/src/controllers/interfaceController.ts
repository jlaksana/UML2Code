import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import { reformatEntity, validateEntity } from './entityServices';

const createInterface = async (data: unknown, diagramId: string) => {
  const validatedData = await validateEntity(data, diagramId);

  if (validatedData.attributes) {
    throw new Error('Invalid - Ensure all fields are present and valid');
  }

  try {
    const entity = new EntityModel({
      diagramId,
      type: 'interface',
      data: {
        name: removeWhitespace(validatedData.name),
        constants: validatedData.constants?.map((constant) => ({
          ...constant,
          name: removeWhitespace(constant.name),
        })),
        methods: validatedData.methods?.map((method) => ({
          ...method,
          name: removeWhitespace(method.name),
        })),
      },
    });
    await entity.save();

    // reformat the entity for client
    const reformattedEntity = reformatEntity(entity);
    delete reformattedEntity.data.attributes;
    delete reformattedEntity.data.isAbstract;
    return reformattedEntity;
  } catch (e) {
    console.log(e);
    throw new Error('Could not create an interface');
  }
};

// eslint-disable-next-line import/prefer-default-export
export { createInterface };
