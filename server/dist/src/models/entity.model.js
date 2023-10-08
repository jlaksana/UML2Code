"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySchema = exports.entityData = exports.EntityModel = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const diagram_model_1 = require("./diagram.model");
const entityConstant = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
});
const entityAttribute = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1),
    visibility: zod_1.z.enum(['+', '—', '#']),
    type: zod_1.z.string().min(1),
});
const entityMethod = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1),
    returnType: zod_1.z.string(),
    visibility: zod_1.z.enum(['+', '—', '#']),
    isStatic: zod_1.z.boolean(),
});
const entityData = zod_1.z.object({
    name: zod_1.z.string().min(1),
    isAbstract: zod_1.z.boolean().optional(),
    constants: zod_1.z.array(entityConstant).optional(),
    attributes: zod_1.z.array(entityAttribute).optional(),
    methods: zod_1.z.array(entityMethod).optional(),
});
exports.entityData = entityData;
const entitySchema = zod_1.z.object({
    diagramId: zod_1.z.number().min(1000),
    type: zod_1.z.enum(['class', 'interface', 'enum']),
    position: zod_1.z.object({ x: zod_1.z.number(), y: zod_1.z.number() }),
    data: entityData,
});
exports.entitySchema = entitySchema;
const schema = new mongoose_1.Schema({
    diagramId: { type: Number, ref: 'Diagram', required: true },
    type: {
        type: String,
        enum: ['class', 'interface', 'enum'],
        required: true,
    },
    position: {
        x: { type: Number, required: true, default: 0 },
        y: { type: Number, required: true, default: 0 },
    },
    data: {
        name: { type: String, required: true },
        isAbstract: { type: Boolean, default: false },
        constants: [
            {
                _id: false,
                id: { type: Number, required: true },
                name: { type: String, required: true },
                type: {
                    type: String,
                    required: true,
                },
            },
        ],
        attributes: [
            {
                _id: false,
                id: { type: Number, required: true },
                name: { type: String, required: true },
                visibility: { type: String, enum: ['+', '—', '#'], required: true },
                type: {
                    type: String,
                    required: true,
                },
            },
        ],
        methods: [
            {
                _id: false,
                id: { type: Number, required: true },
                name: { type: String, required: true },
                isStatic: { type: Boolean, default: false },
                visibility: { type: String, enum: ['+', '—', '#'], required: true },
                returnType: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
});
// validate diagramId to be an existing diagram
schema.path('diagramId').validate(async (value) => {
    const count = await diagram_model_1.DiagramModel.countDocuments({ _id: value });
    return count === 1;
}, 'Invalid diagram ID');
const EntityModel = (0, mongoose_1.model)('Entity', schema);
exports.EntityModel = EntityModel;
//# sourceMappingURL=entity.model.js.map