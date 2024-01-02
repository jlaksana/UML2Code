"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRelationshipHandleUpdate = exports.validateRelationship = exports.validateDuplicateRelationship = exports.reformatRelationship = void 0;
/* eslint-disable @typescript-eslint/no-use-before-define */
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const zod_1 = require("zod");
const diagram_model_1 = require("../models/diagram.model");
const entity_model_1 = require("../models/entity.model");
const relationship_model_1 = require("../models/relationship.model");
const relationshipUISchema = zod_1.z.object({
    type: zod_1.z.enum([
        'Inheritance',
        'Association',
        'Aggregation',
        'Composition',
        'Implementation',
        'Dependency',
    ]),
    source: zod_1.z.string(),
    target: zod_1.z.string(),
    sourceHandle: zod_1.z.string().optional(),
    targetHandle: zod_1.z.string().optional(),
    label: zod_1.z.string().optional(),
    srcMultiplicity: zod_1.z.string().regex(relationship_model_1.umlMultiplicityRegex).optional(),
    tgtMultiplicity: zod_1.z.string().regex(relationship_model_1.umlMultiplicityRegex).optional(),
});
const validateRelationship = async (data, diagramId, isUpdate) => {
    if (diagramId === undefined) {
        throw new Error('Must provide a diagram id');
    }
    // validate all fields are present and valid
    const parsedDataFromUI = relationshipUISchema.safeParse(data);
    if (!parsedDataFromUI.success) {
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
    // validate source and target
    const { sourceId, targetId } = await validateSourceAndTarget(parsedDataFromUI.data.source, parsedDataFromUI.data.target, diagramId, parsedDataFromUI.data.type, isUpdate);
    const reformattedData = {
        type: parsedDataFromUI.data.type,
        diagramId: parseInt(diagramId, 10),
        source: sourceId,
        target: targetId,
        sourceHandle: parsedDataFromUI.data.sourceHandle,
        targetHandle: parsedDataFromUI.data.targetHandle,
        data: {
            label: parsedDataFromUI.data.label,
            srcMultiplicity: parsedDataFromUI.data.srcMultiplicity,
            tgtMultiplicity: parsedDataFromUI.data.tgtMultiplicity,
        },
    };
    return reformattedData;
};
exports.validateRelationship = validateRelationship;
const validateSourceAndTarget = async (sourceName, targetName, diagramId, relationshipType, isHandleUpdate) => {
    let sourceEntity;
    let targetEntity;
    if (isHandleUpdate) {
        sourceEntity = await entity_model_1.EntityModel.findById(sourceName);
        targetEntity = await entity_model_1.EntityModel.findById(targetName);
    }
    else {
        sourceEntity = await entity_model_1.EntityModel.findOne({
            diagramId,
            'data.name': sourceName,
        });
        targetEntity = await entity_model_1.EntityModel.findOne({
            diagramId,
            'data.name': targetName,
        });
    }
    if (!sourceEntity || !targetEntity) {
        throw new Error('Invalid source or target');
    }
    try {
        switch (relationshipType) {
            case 'Implementation':
                if (sourceEntity._id.equals(targetEntity._id) ||
                    sourceEntity.type !== 'interface' ||
                    targetEntity.type !== 'class') {
                    throw new Error();
                }
                break;
            case 'Inheritance':
                if (sourceEntity._id.equals(targetEntity._id) ||
                    sourceEntity.type !== targetEntity.type ||
                    sourceEntity.type === 'enum') {
                    throw new Error();
                }
                break;
            case 'Composition':
                if (sourceEntity._id.equals(targetEntity._id)) {
                    throw new Error();
                }
            // eslint-disable-next-line no-fallthrough
            case 'Association':
            case 'Aggregation':
                if (sourceEntity.type === 'enum') {
                    throw new Error();
                }
                break;
            case 'Dependency':
                if (targetEntity.type === 'enum') {
                    throw new Error();
                }
                break;
            default:
                throw new Error();
        }
    }
    catch (e) {
        throw new Error('Invalid source or target for relationship type');
    }
    return { sourceId: sourceEntity._id, targetId: targetEntity._id };
};
const reformatRelationship = (relationship) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reformattedRelationship = relationship.toObject();
    // rename _id to id
    reformattedRelationship.id = reformattedRelationship._id;
    switch (reformattedRelationship.type) {
        case 'Inheritance':
        case 'Implementation':
        case 'Dependency':
            return (0, lodash_pick_1.default)(reformattedRelationship, [
                'id',
                'source',
                'target',
                'type',
                'sourceHandle',
                'targetHandle',
            ]);
        case 'Association':
        case 'Aggregation':
        case 'Composition':
            return (0, lodash_pick_1.default)(reformattedRelationship, [
                'id',
                'source',
                'target',
                'type',
                'sourceHandle',
                'targetHandle',
                'data',
            ]);
        default:
            throw new Error('Invalid relationship type');
    }
};
exports.reformatRelationship = reformatRelationship;
const validateDuplicateRelationship = async (diagramId, type, source, target, relationshipId) => {
    // only allow one relationship of type Inheritance, Implementation, or Dependency between two entities
    if (type !== 'Inheritance' &&
        type !== 'Implementation' &&
        type !== 'Dependency') {
        return true;
    }
    const relationship = await relationship_model_1.RelationshipModel.findOne({
        diagramId,
        type,
        source,
        target,
    });
    if (relationship !== null && relationship.id !== relationshipId) {
        throw new Error('Diagram already has a relationship of this type');
    }
    // an entity can only inherit from one entity
    if (type === 'Inheritance') {
        const relationship2 = await relationship_model_1.RelationshipModel.findOne({
            diagramId,
            type,
            target,
        });
        if (relationship2 !== null && relationship2.id !== relationshipId) {
            throw new Error('An entity can only inherit from one entity');
        }
    }
    return true;
};
exports.validateDuplicateRelationship = validateDuplicateRelationship;
const newConnectionSchema = zod_1.z.object({
    type: relationship_model_1.RelationshipVariant,
    source: zod_1.z.string(),
    sourceHandle: relationship_model_1.HandlePositions,
    target: zod_1.z.string(),
    targetHandle: relationship_model_1.HandlePositions,
});
const validateRelationshipHandleUpdate = async (relationshipId, handleData, diagramId) => {
    const parsedData = newConnectionSchema.safeParse(handleData);
    if (!parsedData.success) {
        throw new Error('Could not update relationship position');
    }
    // validate source and target
    const { sourceId, targetId } = await validateSourceAndTarget(parsedData.data.source, parsedData.data.target, diagramId, parsedData.data.type, true);
    await validateDuplicateRelationship(diagramId, parsedData.data.type, sourceId, targetId, relationshipId);
    return parsedData.data;
};
exports.validateRelationshipHandleUpdate = validateRelationshipHandleUpdate;
//# sourceMappingURL=relationshipService.js.map