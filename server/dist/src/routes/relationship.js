"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const relationshipController_1 = require("../controllers/relationshipController");
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
/**
 * GET a relationship given an id
 * @route GET /api/relationship/:id?diagramId=
 * @access Private
 * @param {string} id - relationship id
 * @returns {object} 200 - Relationship object
 */
router.get('/:id', auth_1.default, async (req, res) => {
    const { diagramId } = req.query;
    try {
        const relationship = await (0, relationshipController_1.getRelationship)(req.params.id, diagramId);
        if (!relationship) {
            throw new Error();
        }
        res.status(200).json(relationship);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
/** Create relationship given a diagram id as a parameter and relationship data in body.
 * @route POST /api/relationship
 * @access Private
 * @returns {object} 201 - Relationship object
 * @returns {Error}  400 - Could not create a relationship
 * @returns {Error}  400 - Missing diagram id
 */
router.post('/', auth_1.default, async (req, res) => {
    // validate diagramId to be an existing diagram
    const { diagramId } = req.query;
    try {
        const newRelationship = await (0, relationshipController_1.createRelationship)(req.body, diagramId);
        res.status(201).json(newRelationship);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
/**
 * Edit relationship given a relationship id as a parameter and relationship data in body
 * @route PUT /api/relationship/:id?diagramId=
 * @access Private
 * @param {string} id - relationship id
 * @param {object} body - relationship data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', auth_1.default, async (req, res) => {
    const { diagramId } = req.query;
    const { id } = req.params;
    try {
        const updatedRelationship = await (0, relationshipController_1.editRelationship)(id, diagramId, req.body);
        res.status(200).json(updatedRelationship);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
/**
 * Edit relationship handles given a relationship id as a parameter and handle data in body
 * @route PUT /api/relationship/:id/handle?diagramId=
 * @access Private
 * @param {string} id - relationship id
 * @param {object} body - handle update data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/handle', auth_1.default, async (req, res) => {
    const { diagramId } = req.query;
    const { id } = req.params;
    try {
        await (0, relationshipController_1.editRelationshipHandle)(id, diagramId, req.body);
        res.status(200).json({ message: 'OK' });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
/**
 * @route DELETE /api/relationship/:id?diagramId=
 * @access Private
 * @param {string} id - relationship id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', auth_1.default, async (req, res) => {
    const { id } = req.params;
    try {
        await (0, relationshipController_1.deleteRelationship)(id, req.query.diagramId);
        res.status(204).json({ message: 'OK' });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
exports.default = router;
//# sourceMappingURL=relationship.js.map