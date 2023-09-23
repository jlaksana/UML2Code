"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.umlMultiplicityRegex = exports.relationshipSchema = exports.TargetHandlePositions = exports.SourceHandlePositions = exports.RelationshipVariant = exports.RelationshipModel = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const diagram_model_1 = require("./diagram.model");
const entity_model_1 = require("./entity.model");
const RelationshipVariant = zod_1.z.enum([
    'Inheritance',
    'Association',
    'Aggregation',
    'Composition',
    'Realization',
    'Dependency',
]);
exports.RelationshipVariant = RelationshipVariant;
const SourceHandlePositions = zod_1.z.enum([
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'right-middle',
    'left-bottom',
    'right-bottom',
]);
exports.SourceHandlePositions = SourceHandlePositions;
const TargetHandlePositions = zod_1.z.enum([
    'top-left',
    'top-middle',
    'top-right',
    'left-top',
    'left-middle',
    'right-top',
]);
exports.TargetHandlePositions = TargetHandlePositions;
const umlMultiplicityRegex = /^(?:\d+|\d+\.\.\*|\d+\.\.\d+|\*|)$/;
exports.umlMultiplicityRegex = umlMultiplicityRegex;
const relationshipSchema = zod_1.z.object({
    type: RelationshipVariant,
    diagramId: zod_1.z.number().min(1000).max(999999),
    source: zod_1.z.instanceof(mongoose_1.Schema.Types.ObjectId),
    target: zod_1.z.instanceof(mongoose_1.Schema.Types.ObjectId),
    sourceHandle: SourceHandlePositions.optional(),
    targetHandle: TargetHandlePositions.optional(),
    data: zod_1.z
        .object({
        label: zod_1.z.string().optional(),
        srcMultiplicity: zod_1.z.string().regex(umlMultiplicityRegex).optional(),
        tgtMultiplicity: zod_1.z.string().regex(umlMultiplicityRegex).optional(),
    })
        .optional(),
});
exports.relationshipSchema = relationshipSchema;
const schema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: [
            'Inheritance',
            'Association',
            'Aggregation',
            'Composition',
            'Realization',
            'Dependency',
        ],
        required: true,
    },
    diagramId: { type: Number, ref: 'Diagram', required: true },
    source: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Entity', required: true },
    target: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Entity', required: true },
    sourceHandle: {
        type: String,
        enum: [
            'bottom-left',
            'bottom-middle',
            'bottom-right',
            'right-top',
            'right-middle',
            'right-bottom',
        ],
        default: 'bottom-middle',
    },
    targetHandle: {
        type: String,
        enum: [
            'top-left',
            'top-middle',
            'top-right',
            'left-top',
            'left-middle',
            'left-bottom',
        ],
        default: 'top-middle',
    },
    data: {
        label: { type: String, default: '' },
        srcMultiplicity: { type: String, default: '' },
        tgtMultiplicity: { type: String, default: '' },
    },
});
// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (diagramId) => {
    const diagram = await diagram_model_1.DiagramModel.findById(diagramId);
    return !!diagram;
}, 'Invalid diagram ID');
// validate src to be an existing entity
schema.path('source').validate(async (src) => {
    const entity = await entity_model_1.EntityModel.findById(src);
    return !!entity;
}, 'Invalid source entity ID');
// validate tar to be an existing entity
schema.path('target').validate(async (tar) => {
    const entity = await entity_model_1.EntityModel.findById(tar);
    return !!entity;
}, 'Invalid target entity ID');
const RelationshipModel = (0, mongoose_1.model)('Relationship', schema);
exports.RelationshipModel = RelationshipModel;
//# sourceMappingURL=relationship.model.js.map