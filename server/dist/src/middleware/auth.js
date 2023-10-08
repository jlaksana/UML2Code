"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const diagram_model_1 = require("../models/diagram.model");
const withAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            throw new Error('No token provided');
        if (process.env.JWT_SECRET === undefined) {
            console.log('JWT secret is undefined');
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.diagramId === undefined) {
            console.log('Decoded diagram id is undefined');
            throw new Error();
        }
        const diagram = await diagram_model_1.DiagramModel.findById(decoded.diagramId);
        if (!diagram) {
            throw new Error();
        }
        req.diagramId = decoded.diagramId;
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
        console.log(e);
    }
};
exports.default = withAuth;
//# sourceMappingURL=auth.js.map