"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePosition = exports.editClass = exports.deleteEntity = exports.createClass = void 0;
const entity_model_1 = require("../models/entity.model");
const relationship_model_1 = require("../models/relationship.model");
const utils_1 = require("../utils");
const entityServices_1 = require("./entityServices");
const createClass = async (data, diagramId) => {
    const validatedData = await (0, entityServices_1.validateEntity)(data, diagramId);
    await (0, entityServices_1.validateDuplicateEntity)(validatedData.name, diagramId);
    try {
        // create a new entity while removing whitespace from all names
        const entity = new entity_model_1.EntityModel({
            diagramId,
            type: 'class',
            data: {
                name: (0, utils_1.removeWhitespace)(validatedData.name),
                isAbstract: validatedData.isAbstract || false,
                constants: validatedData.constants?.map((constant) => ({
                    ...constant,
                    name: (0, utils_1.removeWhitespace)(constant.name),
                })),
                attributes: validatedData.attributes?.map((attribute) => ({
                    ...attribute,
                    name: (0, utils_1.removeWhitespace)(attribute.name),
                })),
                methods: validatedData.methods?.map((method) => ({
                    ...method,
                    name: (0, utils_1.removeWhitespace)(method.name),
                })),
            },
        });
        await entity.save();
        return (0, entityServices_1.reformatClass)(entity);
    }
    catch (e) {
        // could not create a class in database
        console.log(e);
        throw new Error('Could not create a class');
    }
};
exports.createClass = createClass;
const editClass = async (classId, diagramId, data) => {
    const validatedData = await (0, entityServices_1.validateEntity)(data, diagramId);
    try {
        await (0, entityServices_1.validateDuplicateEntity)(validatedData.name, diagramId, classId);
        const klass = await entity_model_1.EntityModel.findByIdAndUpdate(classId, {
            data: validatedData,
        }, { new: true });
        if (!klass) {
            throw new Error();
        }
        return (0, entityServices_1.reformatClass)(klass);
    }
    catch (e) {
        throw new Error(`Could not update a class with the given id: ${classId}`);
    }
};
exports.editClass = editClass;
const deleteEntity = async (entityId, diagramId) => {
    try {
        const entity = await entity_model_1.EntityModel.findOneAndDelete({
            _id: entityId,
            diagramId,
        });
        if (!entity) {
            throw new Error();
        }
        // delete all relationships that are connected to the entity
        await relationship_model_1.RelationshipModel.deleteMany({
            $or: [{ source: entityId }, { target: entityId }],
        }).exec();
    }
    catch (e) {
        throw new Error(`Could not delete entity with the given id: ${entityId}`);
    }
};
exports.deleteEntity = deleteEntity;
const updatePosition = async (entityId, diagramId, position) => {
    try {
        const entity = await entity_model_1.EntityModel.findOneAndUpdate({ _id: entityId, diagramId }, {
            position,
        });
        if (!entity) {
            throw new Error();
        }
    }
    catch (e) {
        throw new Error(`Could not update an entity position with the given id: ${entityId}`);
    }
};
exports.updatePosition = updatePosition;
//# sourceMappingURL=classController.js.map