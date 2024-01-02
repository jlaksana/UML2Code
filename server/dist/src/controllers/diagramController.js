"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDiagramPrivacy = exports.renameDiagram = exports.getDiagramsForUser = exports.getDiagramPrivacy = exports.getDiagramContentsPublic = exports.getDiagramContents = exports.deleteDiagram = exports.createDiagram = void 0;
const mongoose_1 = require("mongoose");
const diagram_model_1 = require("../models/diagram.model");
const entity_model_1 = require("../models/entity.model");
const relationship_model_1 = require("../models/relationship.model");
const user_model_1 = require("../models/user.model");
const entityServices_1 = require("./entityServices");
const relationshipService_1 = require("./relationshipService");
/** Get all diagrams for a userId
 * @param userId of the user to get diagrams for
 * @returns all diagrams for the user
 */
const getDiagramsForUser = async (userId) => {
    const diagrams = await diagram_model_1.DiagramModel.find({ userId });
    return diagrams.map((d) => ({
        id: d._id,
        name: d.name,
        modified: d.updatedAt,
    }));
};
exports.getDiagramsForUser = getDiagramsForUser;
/**
 * Retrieves all entities and relationships of a diagram, and
 * returns them in a format that can be used by the client
 * @param id id of the diagram to retrieve
 * @returns the entities and relationships of the diagram
 */
const getDiagramContents = async (id) => {
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new Error('Diagram not found');
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    const entities = await entity_model_1.EntityModel.find({ diagramId: diagram._id });
    const classes = entities
        .filter((entity) => entity.type === 'class')
        .map((c) => (0, entityServices_1.reformatClass)(c));
    const interfaces = entities
        .filter((entity) => entity.type === 'interface')
        .map((i) => (0, entityServices_1.reformatInterface)(i));
    const enums = entities
        .filter((entity) => entity.type === 'enum')
        .map((e) => (0, entityServices_1.reformatEnum)(e));
    const relationships = await relationship_model_1.RelationshipModel.find({
        diagramId: diagram._id,
    });
    return {
        diagramId: diagram.id,
        name: diagram.name,
        entities: [...classes, ...interfaces, ...enums],
        relationships: relationships.map((r) => (0, relationshipService_1.reformatRelationship)(r)),
    };
};
exports.getDiagramContents = getDiagramContents;
/**
 * Get the contents of a public diagram. Errors if diagram is private
 * @param id of diagram to get
 * @returns the entities and relationships of the diagram
 */
const getDiagramContentsPublic = async (id) => {
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    if (!diagram.isPublic)
        throw new Error('Diagram is private');
    return getDiagramContents(id);
};
exports.getDiagramContentsPublic = getDiagramContentsPublic;
/**
 * Creates a diagram
 * @param userId of the user creating the diagram
 * @returns the created diagram
 * @throws an error if the password is invalid
 * @throws an error if the diagram could not be created
 */
const createDiagram = async (userId) => {
    if (!userId)
        throw new Error('Invalid user id');
    const user = user_model_1.UserModel.findById(userId);
    if (!user)
        throw new Error('User not found');
    const diagram = new diagram_model_1.DiagramModel({
        isPublic: false,
        userId,
    });
    await diagram.save();
    return diagram;
};
exports.createDiagram = createDiagram;
const renameDiagram = async (id, name) => {
    if (!name)
        throw new Error('Invalid name');
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new Error('Diagram not found');
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    diagram.name = name;
    await diagram.save();
};
exports.renameDiagram = renameDiagram;
/**
 * @param id of the diagram to retrieve
 * @returns true if the diagram is public, false if it is private
 */
const getDiagramPrivacy = async (id) => {
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new Error('Diagram not found');
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    return diagram.isPublic;
};
exports.getDiagramPrivacy = getDiagramPrivacy;
const setDiagramPrivacy = async (id, isPublic) => {
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new Error('Diagram not found');
    if (isPublic === undefined)
        throw new Error('Invalid privacy value');
    await diagram_model_1.DiagramModel.findByIdAndUpdate(id, { isPublic });
};
exports.setDiagramPrivacy = setDiagramPrivacy;
const deleteDiagram = async (id) => {
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new Error('Diagram not found');
    await diagram_model_1.DiagramModel.findByIdAndDelete(id);
};
exports.deleteDiagram = deleteDiagram;
//# sourceMappingURL=diagramController.js.map