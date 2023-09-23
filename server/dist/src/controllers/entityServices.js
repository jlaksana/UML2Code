"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntity = exports.validateDuplicateEntity = exports.reformatInterface = exports.reformatEnum = exports.reformatClass = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const diagram_model_1 = require("../models/diagram.model");
const entity_model_1 = require("../models/entity.model");
const utils_1 = require("../utils");
// validate that the entity name is unique in the diagram
const validateDuplicateEntity = async (name, diagramId, entityId) => {
    const strippedName = (0, utils_1.removeWhitespace)(name);
    let count;
    if (entityId) {
        // if editing an entity, allow the name to be the same as the current name
        count = await entity_model_1.EntityModel.countDocuments({
            diagramId,
            'data.name': strippedName,
            _id: { $ne: entityId },
        });
    }
    else {
        count = await entity_model_1.EntityModel.countDocuments({
            diagramId,
            'data.name': strippedName,
        });
    }
    if (count > 0) {
        throw new Error(`An entity with the name "${name}" already exists in the diagram`);
    }
    return strippedName;
};
exports.validateDuplicateEntity = validateDuplicateEntity;
// validate data to be a valid entity and diagram id to be an existing diagram
const validateEntity = async (data, diagramId) => {
    const parseResult = entity_model_1.entityData.safeParse(data);
    if (!parseResult.success) {
        // incorrect data format
        throw new Error('Invalid - Ensure all fields are present and valid');
    }
    else {
        // query for the diagram
        try {
            const diagram = await diagram_model_1.DiagramModel.findById(diagramId);
            if (!diagram) {
                throw new Error();
            }
        }
        catch (e) {
            throw new Error(`Could not find a diagram with the given id: ${diagramId}`);
        }
    }
    return parseResult.data;
};
exports.validateEntity = validateEntity;
// reformat the entity from the database to expected format for a class
const reformatClass = (entity) => {
    const reformattedClass = entity.toObject();
    // rename _id to id
    reformattedClass.id = reformattedClass._id;
    // remove _id from all subdocuments
    reformattedClass.data = {
        ...reformattedClass.data,
        constants: reformattedClass.data.constants.map((constant) => (0, lodash_pick_1.default)(constant, ['id', 'name', 'type'])),
        attributes: reformattedClass.data.attributes.map((attribute) => (0, lodash_pick_1.default)(attribute, ['id', 'name', 'type', 'visibility'])),
        methods: reformattedClass.data.methods.map((method) => (0, lodash_pick_1.default)(method, ['id', 'name', 'returnType', 'visibility', 'isStatic'])),
    };
    return (0, lodash_pick_1.default)(reformattedClass, ['id', 'type', 'position', 'data']);
};
exports.reformatClass = reformatClass;
const reformatInterface = (entity) => {
    const reformattedInterface = entity.toObject();
    // rename _id to id
    reformattedInterface.id = reformattedInterface._id;
    // remove _id from all subdocuments
    reformattedInterface.data = {
        name: reformattedInterface.data.name,
        constants: reformattedInterface.data.constants.map((constant) => (0, lodash_pick_1.default)(constant, ['id', 'name', 'type'])),
        methods: reformattedInterface.data.methods.map((method) => (0, lodash_pick_1.default)(method, ['id', 'name', 'returnType', 'visibility', 'isStatic'])),
    };
    return (0, lodash_pick_1.default)(reformattedInterface, [
        'id',
        'type',
        'position',
        'data',
    ]);
};
exports.reformatInterface = reformatInterface;
const reformatEnum = (entity) => {
    const reformattedEnum = entity.toObject();
    // rename _id to id
    reformattedEnum.id = reformattedEnum._id;
    // remove _id from all subdocuments
    reformattedEnum.data = {
        name: reformattedEnum.data.name,
        values: reformattedEnum.data.constants.map((constant) => (0, lodash_pick_1.default)(constant, ['id', 'name'])),
    };
    return (0, lodash_pick_1.default)(reformattedEnum, ['id', 'type', 'position', 'data']);
};
exports.reformatEnum = reformatEnum;
//# sourceMappingURL=entityServices.js.map