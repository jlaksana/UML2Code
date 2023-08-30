import { RelationshipModel } from '../models/relationship.model';
import {
  reformatRelationship,
  validateRelationship,
} from './relationshipService';

const createRelationship = async (data: unknown, diagramId: string) => {
  const validatedData = await validateRelationship(data, diagramId);

  try {
    const relationship = new RelationshipModel({
      type: validatedData.type,
      diagramId,
      source: validatedData.source,
      target: validatedData.target,
      data: validatedData.data,
    });
    await relationship.save();

    return reformatRelationship(relationship as never);
  } catch (e) {
    // could not create a relationship in database
    console.log(e);
    throw new Error('Could not create a relationship');
  }
};

const editRelationship = async (
  relationshipId: string,
  diagramId: string,
  data: unknown
) => {};

const deleteRelationship = async (relationshipId: string) => {};

export { createRelationship, deleteRelationship, editRelationship };
