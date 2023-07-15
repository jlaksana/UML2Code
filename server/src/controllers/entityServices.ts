import { DiagramModel } from '../models/diagram.model';
import { Entity, EntityModel, entityData } from '../models/entity.model';
import { removeWhitespace } from '../utils';

// validate that the entity name is unique in the diagram
const validateDuplicateEntity = async (name: string, diagramId: string) => {
  const strippedName = removeWhitespace(name);
  const count = await EntityModel.countDocuments({
    diagramId,
    'data.name': strippedName,
  });
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

  await validateDuplicateEntity(parseResult.data.name, diagramId);

  return parseResult.data;
};

const reformatEntity = (entity: Entity) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reformattedEntity: any = entity.toObject();
  // rename _id to id
  reformattedEntity.id = reformattedEntity._id;
  delete reformattedEntity._id;
  delete reformattedEntity.__v;
  delete reformattedEntity.diagramId;

  return reformattedEntity;
};

export { reformatEntity, validateDuplicateEntity, validateEntity };
