"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagramController_1 = require("../controllers/diagramController");
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
/** GET all diagrams for a user
 * @route GET /api/diagram
 * @access Private
 * @returns {object} 200 - list of Diagram object
 */
router.get('/', auth_1.default, async (req, res) => {
    try {
        const diagrams = await (0, diagramController_1.getDiagramsForUser)(req.userId);
        res.status(200).json(diagrams);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** GET diagram contents by id.
 * @route GET /api/diagram/:diagramId/contents
 * @access Private
 * @returns {object} 200 - Diagram contents object
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 * @example response - 200 - Diagram contents object
 * {
 *  "diagramId": "1000",
 *  "entities": [],
 * "relationships": []
 */
router.get('/:diagramId/contents', auth_1.default, async (req, res) => {
    try {
        const result = await (0, diagramController_1.getDiagramContents)(req.params.diagramId);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** GET diagram contents by id.
 * @route GET /api/diagram/:diagramId/public/contents
 * @access Public
 * @returns {object} 200 - Diagram contents object
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 * @returns {Error}  404 - Diagram is private
 */
router.get('/:diagramId/public/contents', async (req, res) => {
    try {
        const result = await (0, diagramController_1.getDiagramContentsPublic)(req.params.diagramId);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** Creates a diagram
 * @route POST /api/diagram
 * @access Public
 * @returns {object} 201 - Diagram object
 * @returns {Error}  400 - Could not create a diagram
 * @example response - 200 - Success message
 */
router.post('/', auth_1.default, async (req, res) => {
    try {
        const diagram = await (0, diagramController_1.createDiagram)(req.body.userId);
        res.status(201).json({ id: diagram._id });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * Renames a diagram
 * @route POST /api/diagram/:diagramId/rename
 * @access Private
 * @returns {object} 200 - Success message
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid name
 */
router.put('/:diagramId/rename', auth_1.default, async (req, res) => {
    try {
        await (0, diagramController_1.renameDiagram)(req.params.diagramId, req.body.name);
        res.status(200).json({ message: 'OK' });
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * Retrieves the privacy of a diagram
 * @route GET /api/diagram/:diagramId/privacy
 * @access Private
 * @returns {object} 200 - True if public, false if private
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 */
router.get('/:diagramId/privacy', auth_1.default, async (req, res) => {
    try {
        const result = await (0, diagramController_1.getDiagramPrivacy)(req.params.diagramId);
        res.status(200).json({ isPublic: result });
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * sets the privacy of a diagram to public or private
 * @route PUT /api/diagram/:diagramId/privacy
 * @access Private
 */
router.put('/:diagramId/privacy', auth_1.default, async (req, res) => {
    try {
        await (0, diagramController_1.setDiagramPrivacy)(req.params.diagramId, req.body.isPublic);
        res.status(200).json({ message: 'OK' });
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
router.delete('/:diagramId', auth_1.default, async (req, res) => {
    try {
        await (0, diagramController_1.deleteDiagram)(req.params.diagramId);
        res.status(200).json({ message: 'OK' });
    }
    catch (e) {
        res.status(404).json({ message: 'Could not delete diagram' });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
exports.default = router;
//# sourceMappingURL=diagrams.js.map