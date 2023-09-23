"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationship = exports.editRelationshipHandle = exports.editRelationship = exports.deleteRelationship = exports.createRelationship = void 0;
const entity_model_1 = require("../models/entity.model");
const relationship_model_1 = require("../models/relationship.model");
const relationshipService_1 = require("./relationshipService");
const getRelationship = async (relationshipId, diagramId) => {
    try {
        const relationship = await relationship_model_1.RelationshipModel.findOne({
            _id: relationshipId,
            diagramId,
        });
        if (!relationship) {
            throw new Error();
        }
        const result = (0, relationshipService_1.reformatRelationship)(relationship);
        const source = await entity_model_1.EntityModel.findById(result.source);
        result.source = source?.data.name;
        const target = await entity_model_1.EntityModel.findById(result.target);
        result.target = target?.data.name;
        return result;
    }
    catch (e) {
        console.log(e);
        throw new Error(`Could not find relationship with given id: ${relationshipId}`);
    }
};
exports.getRelationship = getRelationship;
const createRelationship = async (data, diagramId) => {
    const validatedData = await (0, relationshipService_1.validateRelationship)(data, diagramId, false);
    await (0, relationshipService_1.validateDuplicateRelationship)(diagramId, validatedData.type, validatedData.source, validatedData.target);
    try {
        const relationship = new relationship_model_1.RelationshipModel({
            type: validatedData.type,
            diagramId,
            source: validatedData.source,
            target: validatedData.target,
            data: validatedData.data,
        });
        await relationship.save();
        return (0, relationshipService_1.reformatRelationship)(relationship);
    }
    catch (e) {
        // could not create a relationship in database
        console.log(e);
        throw new Error('Could not create a relationship');
    }
};
exports.createRelationship = createRelationship;
const editRelationship = async (relationshipId, diagramId, data) => {
    const validatedData = await (0, relationshipService_1.validateRelationship)(data, diagramId, false);
    await (0, relationshipService_1.validateDuplicateRelationship)(diagramId, validatedData.type, validatedData.source, validatedData.target, relationshipId);
    try {
        const relationship = await relationship_model_1.RelationshipModel.findByIdAndUpdate(relationshipId, {
            type: validatedData.type,
            source: validatedData.source,
            target: validatedData.target,
            data: validatedData.data,
        }, { new: true });
        if (!relationship) {
            throw new Error();
        }
        return (0, relationshipService_1.reformatRelationship)(relationship);
    }
    catch (e) {
        console.log(e);
        throw new Error(`Could not update relationship with given id: ${relationshipId}`);
    }
};
exports.editRelationship = editRelationship;
const editRelationshipHandle = async (relationshipId, diagramId, handleData) => {
    const validatedData = await (0, relationshipService_1.validateRelationshipHandleUpdate)(relationshipId, handleData, diagramId);
    try {
        const relationship = await relationship_model_1.RelationshipModel.findByIdAndUpdate(relationshipId, {
            source: validatedData.source,
            sourceHandle: validatedData.sourceHandle,
            target: validatedData.target,
            targetHandle: validatedData.targetHandle,
        }, { new: true });
        if (!relationship) {
            throw new Error();
        }
    }
    catch (e) {
        console.log(e);
        throw new Error(`Could not update relationship with given id: ${relationshipId}`);
    }
};
exports.editRelationshipHandle = editRelationshipHandle;
const deleteRelationship = async (relationshipId) => {
    const relationship = await relationship_model_1.RelationshipModel.findByIdAndDelete(relationshipId);
    if (!relationship) {
        throw new Error('Could not find relationship');
    }
};
exports.deleteRelationship = deleteRelationship;
//# sourceMappingURL=relationshipController.js.map