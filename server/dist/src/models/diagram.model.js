"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagramSchema = exports.DiagramModel = exports.CounterModel = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const diagramSchema = zod_1.z.object({
    _id: zod_1.z.coerce.number().min(1000).max(999999),
    password: zod_1.z.string(),
    isPublic: zod_1.z.boolean(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.diagramSchema = diagramSchema;
const schema = new mongoose_1.Schema({
    _id: {
        type: Number,
        min: 1000,
        max: 999999,
    },
    password: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
const DiagramModel = (0, mongoose_1.model)('Diagram', schema);
exports.DiagramModel = DiagramModel;
// Counter schema to generate unique diagram id
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, min: 1000, max: 999999 },
});
const CounterModel = (0, mongoose_1.model)('Counter', counterSchema);
exports.CounterModel = CounterModel;
//# sourceMappingURL=diagram.model.js.map