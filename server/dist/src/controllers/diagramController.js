"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDiagramPrivacy = exports.loginToDiagram = exports.getDiagramPrivacy = exports.getDiagramContentsPublic = exports.getDiagramContents = exports.findDiagramById = exports.createDiagram = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const diagram_model_1 = require("../models/diagram.model");
const entity_model_1 = require("../models/entity.model");
const relationship_model_1 = require("../models/relationship.model");
const utils_1 = require("../utils");
const entityServices_1 = require("./entityServices");
const relationshipService_1 = require("./relationshipService");
const idRegex = /^\d+$/;
/** Logs in to a diagram
 * @param id id of the diagram to log in to
 * @param password password of the diagram to log in to
 * @returns a JWT token
 */
const loginToDiagram = async (id, password) => {
    if (!idRegex.test(id))
        throw new Error('Invalid Diagram id');
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    if (!password || typeof password !== 'string')
        throw new Error('Invalid password');
    const match = await bcrypt_1.default.compare(password, diagram.password);
    if (!match)
        throw new Error('Invalid password');
    if (process.env.JWT_SECRET === undefined) {
        console.log('JWT secret is undefined');
        throw new Error('Server Error');
    }
    const token = jsonwebtoken_1.default.sign({ diagramId: diagram._id }, process.env.JWT_SECRET, {
        expiresIn: '8h',
    });
    return token;
};
exports.loginToDiagram = loginToDiagram;
/**
 * Retrieves a diagram by id
 * @param id of the diagram to retrieve
 * @returns the diagram
 */
const findDiagramById = async (id) => {
    if (!idRegex.test(id))
        throw new Error('Invalid Diagram id');
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    return { id: diagram._id };
};
exports.findDiagramById = findDiagramById;
/**
 * Retrieves all entities and relationships of a diagram, and
 * returns them in a format that can be used by the client
 * @param id id of the diagram to retrieve
 * @returns the entities and relationships of the diagram
 */
const getDiagramContents = async (id) => {
    const diagram = await findDiagramById(id);
    const entities = await entity_model_1.EntityModel.find({ diagramId: diagram.id });
    const classes = entities
        .filter((entity) => entity.type === 'class')
        .map((c) => (0, entityServices_1.reformatClass)(c));
    const interfaces = entities
        .filter((entity) => entity.type === 'interface')
        .map((i) => (0, entityServices_1.reformatInterface)(i));
    const enums = entities
        .filter((entity) => entity.type === 'enum')
        .map((e) => (0, entityServices_1.reformatEnum)(e));
    const relationships = await relationship_model_1.RelationshipModel.find({ diagramId: diagram.id });
    return {
        diagramId: diagram.id,
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
    if (!idRegex.test(id))
        throw new Error('Invalid Diagram id');
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
 * @param password password of the diagram to create
 * @returns the created diagram
 * @throws an error if the password is invalid
 * @throws an error if the diagram could not be created
 */
const createDiagram = async (password) => {
    if (!password || typeof password !== 'string')
        throw new Error('Invalid password');
    if (password.length < 8)
        throw new Error('Password must be at least 8 characters long');
    // hash the password
    try {
        const hash = await bcrypt_1.default.hash(password, 10);
        const diagram = new diagram_model_1.DiagramModel({
            _id: await (0, utils_1.getNextSequence)(),
            password: hash,
        });
        await diagram.save();
        return diagram;
    }
    catch (err) {
        throw new Error('Could not create a diagram');
    }
};
exports.createDiagram = createDiagram;
/**
 * @param id of the diagram to retrieve
 * @returns true if the diagram is public, false if it is private
 */
const getDiagramPrivacy = async (id) => {
    const diagram = await diagram_model_1.DiagramModel.findById(id);
    if (!diagram)
        throw new Error('Diagram not found');
    return diagram.isPublic;
};
exports.getDiagramPrivacy = getDiagramPrivacy;
const setDiagramPrivacy = async (id, isPublic) => {
    if (isPublic === undefined)
        throw new Error('Invalid privacy value');
    await diagram_model_1.DiagramModel.findByIdAndUpdate(id, { isPublic });
};
exports.setDiagramPrivacy = setDiagramPrivacy;
//# sourceMappingURL=diagramController.js.map