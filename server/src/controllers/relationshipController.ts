import { EntityModel } from '../models/entity.model';
import { RelationshipModel } from '../models/relationship.model';
import {
  reformatRelationship,
  validateDuplicateRelationship,
  validateRelationship,
  validateRelationshipHandleUpdate,
} from './relationshipService';

const getRelationship = async (relationshipId: string, diagramId: string) => {
  try {
    const relationship = await RelationshipModel.findOne({
      _id: relationshipId,
      diagramId,
    });
    if (!relationship) {
      throw new Error();
    }
    const result = reformatRelationship(relationship);
    const source = await EntityModel.findById(result.source);
    result.source = source?.data.name;
    const target = await EntityModel.findById(result.target);
    result.target = target?.data.name;
    return result;
  } catch (e) {
    console.log(e);
    throw new Error(
      `Could not find relationship with given id: ${relationshipId}`
    );
  }
};

const createRelationship = async (data: unknown, diagramId: string) => {
  const validatedData = await validateRelationship(data, diagramId, false);
  await validateDuplicateRelationship(
    diagramId,
    validatedData.type,
    validatedData.source,
    validatedData.target
  );

  try {
    const relationship = new RelationshipModel({
      type: validatedData.type,
      diagramId,
      source: validatedData.source,
      target: validatedData.target,
      data: validatedData.data,
    });
    await relationship.save();

    return reformatRelationship(relationship);
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
) => {
  const validatedData = await validateRelationship(data, diagramId, false);
  await validateDuplicateRelationship(
    diagramId,
    validatedData.type,
    validatedData.source,
    validatedData.target,
    relationshipId
  );

  try {
    const relationship = await RelationshipModel.findByIdAndUpdate(
      relationshipId,
      {
        type: validatedData.type,
        source: validatedData.source,
        target: validatedData.target,
        data: validatedData.data,
      },
      { new: true }
    );
    if (!relationship) {
      throw new Error();
    }
    return reformatRelationship(relationship);
  } catch (e) {
    console.log(e);
    throw new Error(
      `Could not update relationship with given id: ${relationshipId}`
    );
  }
};

const editRelationshipHandle = async (
  relationshipId: string,
  diagramId: string,
  handleData: unknown
) => {
  const validatedData = await validateRelationshipHandleUpdate(
    relationshipId,
    handleData,
    diagramId
  );
  try {
    const relationship = await RelationshipModel.findByIdAndUpdate(
      relationshipId,
      {
        source: validatedData.source,
        sourceHandle: validatedData.sourceHandle,
        target: validatedData.target,
        targetHandle: validatedData.targetHandle,
      },
      { new: true }
    );
    if (!relationship) {
      throw new Error();
    }
  } catch (e) {
    console.log(e);
    throw new Error(
      `Could not update relationship with given id: ${relationshipId}`
    );
  }
};

const deleteRelationship = async (
  relationshipId: string,
  diagramId: string
) => {
  const relationship = await RelationshipModel.findOneAndDelete({
    _id: relationshipId,
    diagramId,
  });
  if (!relationship) {
    throw new Error('Could not find relationship');
  }
};

export {
  createRelationship,
  deleteRelationship,
  editRelationship,
  editRelationshipHandle,
  getRelationship,
};
