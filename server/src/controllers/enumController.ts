import { z } from 'zod';
import { DiagramModel } from '../models/diagram.model';
import { EntityModel } from '../models/entity.model';
import { removeWhitespace } from '../utils';
import { reformatEntity, validateDuplicateEntity } from './entityServices';

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

  const name = await validateDuplicateEntity(parseResult.data.name, diagramId);

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

    // reformat the entity for client
    const reformattedEntity = reformatEntity(entity);
    reformattedEntity.data.values =
      reformattedEntity.data.constants.map(
        (constant: { id: number; name: string }) => ({
          id: constant.id,
          name: constant.name,
        })
      ) || [];
    delete reformattedEntity.data.constants;
    delete reformattedEntity.data.attributes;
    delete reformattedEntity.data.methods;
    delete reformattedEntity.data.isAbstract;
    return reformattedEntity;
  } catch (e) {
    console.log(e);
    throw new Error('Could not create an enum');
  }
};

// eslint-disable-next-line import/prefer-default-export
export { createEnum };
