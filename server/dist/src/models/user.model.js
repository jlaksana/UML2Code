"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    verified: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.userSchema = userSchema;
const schema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: { type: String, required: true },
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)('User', schema);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map