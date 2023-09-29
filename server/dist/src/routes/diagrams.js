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
/** Login to a diagram and sets cookie
 * @route POST /api/diagram/:id
 * @access Public
 * @returns {object} 200 - token as cookie
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 */
router.post('/:id/login', async (req, res) => {
    try {
        const token = await (0, diagramController_1.loginToDiagram)(req.params.id, req.body.password);
        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 8 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch (e) {
        res.cookie('token', '', { maxAge: 0 });
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** GET diagram contents by id.
 * @route GET /api/diagram/:id/contents
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
router.get('/:id/contents', auth_1.default, async (req, res) => {
    try {
        // verify requested diagramId matches with token
        if (String(req.diagramId) !== req.params.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await (0, diagramController_1.getDiagramContents)(req.diagramId);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** GET diagram contents by id.
 * @route GET /api/diagram/:id/public/contents
 * @access Public
 * @returns {object} 200 - Diagram contents object
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 * @returns {Error}  404 - Diagram is private
 */
router.get('/:id/public/contents', async (req, res) => {
    try {
        const result = await (0, diagramController_1.getDiagramContentsPublic)(req.params.id);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/** Creates a diagram
 * @route POST /api/diagram/create
 * @access Public
 * @returns {object} 201 - Diagram object
 * @returns {Error}  400 - Could not create a diagram
 * @example response - 200 - Success message
 */
router.post('/create', async (req, res) => {
    try {
        const diagram = await (0, diagramController_1.createDiagram)(req.body.password);
        res.status(201).json({ id: diagram._id });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * Retrieves the privacy of a diagram
 * @route GET /api/diagram/:id/privacy
 * @access Private
 * @returns {object} 200 - True if public, false if private
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 */
router.get('/privacy', auth_1.default, async (req, res) => {
    try {
        const result = await (0, diagramController_1.getDiagramPrivacy)(req.diagramId);
        res.status(200).json({ isPublic: result });
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
router.put('/privacy', auth_1.default, async (req, res) => {
    try {
        await (0, diagramController_1.setDiagramPrivacy)(req.diagramId, req.body.isPublic);
        res.status(200).json({ message: 'OK' });
    }
    catch (e) {
        res.status(404).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
exports.default = router;
//# sourceMappingURL=diagrams.js.map