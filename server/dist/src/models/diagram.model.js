"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagramSchema = exports.DiagramModel = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const diagramSchema = zod_1.z.object({
    name: zod_1.z.string(),
    userId: zod_1.z.string(),
    isPublic: zod_1.z.boolean(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.diagramSchema = diagramSchema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, default: 'Untitled Diagram' },
    userId: { type: String, ref: 'User', required: true },
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
const DiagramModel = (0, mongoose_1.model)('Diagram', schema);
exports.DiagramModel = DiagramModel;
//# sourceMappingURL=diagram.model.js.map