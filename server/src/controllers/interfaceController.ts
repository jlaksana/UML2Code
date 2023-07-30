import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import {
  reformatInterface,
  validateDuplicateEntity,
  validateEntity,
} from './entityServices';

const createInterface = async (data: unknown, diagramId: string) => {
  const validatedData = await validateEntity(data, diagramId);
  await validateDuplicateEntity(validatedData.name, diagramId, null);

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
    return reformatInterface(entity);
  } catch (e) {
    console.log(e);
    throw new Error('Could not create an interface');
  }
};

const editInterface = async (
  interfaceId: string,
  diagramId: string,
  data: unknown
) => {
  const validatedData = await validateEntity(data, diagramId);

  try {
    await validateDuplicateEntity(validatedData.name, diagramId, interfaceId);
    const updatedInterface = await EntityModel.findByIdAndUpdate(
      interfaceId,
      {
        data: validatedData,
      },
      { new: true }
    );
    if (!updatedInterface) {
      throw new Error();
    }
    return reformatInterface(updatedInterface);
  } catch (e) {
    console.log(e);
    throw new Error(
      `Could not update an interface with the given id: ${interfaceId}`
    );
  }
};

const deleteInterface = async (interfaceId: string) => {
  try {
    const deletedInterface = await EntityModel.findByIdAndDelete(interfaceId);
    if (!deletedInterface) {
      throw new Error();
    }
    return reformatInterface(deletedInterface);
  } catch (e) {
    console.log(e);
    throw new Error(
      `Could not delete an interface with the given id: ${interfaceId}`
    );
  }
};

export { createInterface, deleteInterface, editInterface };
