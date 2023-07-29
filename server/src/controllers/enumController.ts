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

const createEnum = async (data: unknown, diagramId: string) => {
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

  const name = await validateDuplicateEntity(
    parseResult.data.name,
    diagramId,
    null
  );

  try {
    const entity = new EntityModel({
      diagramId,
      type: 'enum',
      data: {
        name,
        constants: parseResult.data.values.map((value) => ({
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

// eslint-disable-next-line import/prefer-default-export
export { createEnum };
