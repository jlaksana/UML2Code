import { z } from 'zod';
import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import { reformatEnum, validateDuplicateEntity } from './entityServices';

const enumData = z.object({
  name: z.string().nonempty(),
  values: z
    .array(z.object({ id: z.number(), name: z.string().nonempty() }))
    .min(1),
});

const validateEnum = async (data: unknown, diagramId: string) => {
  const parseResult = enumData.safeParse(data);
  if (!parseResult.success) {
    throw new Error(
      'Invalid - Ensure all fields are present and valid. Must have at least one value'
    );
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

const createEnum = async (data: unknown, diagramId: string) => {
  const validatedEnum = await validateEnum(data, diagramId);
  const name = await validateDuplicateEntity(
    validatedEnum.name,
    diagramId,
    null
  );

  try {
    const entity = new EntityModel({
      diagramId,
      type: 'enum',
      data: {
        name,
        constants: validatedEnum.values.map((value) => ({
          id: value.id,
          name: removeWhitespace(value.name).toUpperCase(),
          type: 'string',
        })),
      },
    });
    await entity.save();

    return reformatEnum(entity);
  } catch (e) {
    console.log(e);
    throw new Error('Could not create an enum');
  }
};

const editEnum = async (enumId: string, diagramId: string, data: unknown) => {
  const validatedEnum = await validateEnum(data, diagramId);

  try {
    await validateDuplicateEntity(validatedEnum.name, diagramId, enumId);
    const updatedEnum = await EntityModel.findByIdAndUpdate(
      enumId,
      {
        data: {
          name: validatedEnum.name,
          constants: validatedEnum.values.map((value) => ({
            id: value.id,
            name: removeWhitespace(value.name).toUpperCase(),
            type: 'string',
          })),
        },
      },
      { new: true }
    );
    if (!updatedEnum) {
      throw new Error();
    }
    return reformatEnum(updatedEnum);
  } catch (e) {
    console.log(e);
    throw new Error(`Could not update an enum with the given id: ${enumId}`);
  }
};

export { createEnum, editEnum };
