import { DiagramModel } from '../models/diagram.model';
import { EntityModel, entityData } from '../models/entity.model';
import { removeWhitespace } from '../utils';

const createClass = async (data: unknown, diagramId: string) => {
  const parseResult = entityData.safeParse(data);
  if (!parseResult.success) {
    // incorrect data format
    throw new Error('Invalid class. Ensure all fields are present and valid');
  } else {
    // query for the diagram
    const diagram = await DiagramModel.findById(diagramId);
    if (!diagram) {
      throw new Error(
        `Could not find a diagram with the given id: ${diagramId}`
      );
    }

    // query entities with the same name and diagram
    const name = removeWhitespace(parseResult.data.name);
    const count = await EntityModel.countDocuments({
      diagramId,
      'data.name': name,
    });
    if (count > 0) {
      throw new Error(
        `An entity with the name ${name} already exists in the diagram`
      );
    }
    try {
      // create a new entity while removing whitespace from all names
      const entity = new EntityModel({
        diagramId,
        type: 'class',
        data: {
          name,
          isAbstract: parseResult.data.isAbstract || false,
          constants: parseResult.data.constants?.map((constant) => ({
            ...constant,
            name: removeWhitespace(constant.name),
          })),
          attributes: parseResult.data.attributes?.map((attribute) => ({
            ...attribute,
            name: removeWhitespace(attribute.name),
          })),
          methods: parseResult.data.methods?.map((method) => ({
            ...method,
            name: removeWhitespace(method.name),
          })),
        },
      });
      await entity.save();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reformattedEntity: any = entity.toObject();
      // rename _id to id
      reformattedEntity.id = reformattedEntity._id;
      delete reformattedEntity._id;
      delete reformattedEntity.__v;
      delete reformattedEntity.diagramId;

      return reformattedEntity;
    } catch (e) {
      // could not create a class in database
      console.log(e);
      throw new Error('Could not create a class');
    }
  }
};

// eslint-disable-next-line import/prefer-default-export
export { createClass };
