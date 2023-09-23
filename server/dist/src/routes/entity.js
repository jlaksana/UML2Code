"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classController_1 = require("../controllers/classController");
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
/**
 * Edits an entity's position in the diagram
 * @route PUT /api/entity/:id/position
 * @access Private
 * @param {string} id - class id
 * @param {object} body - class data
 * @returns status 204 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/position', auth_1.default, async (req, res) => {
    const { id } = req.params;
    const position = req.body;
    try {
        await (0, classController_1.updatePosition)(id, position);
        res.status(204).json({ message: 'Successfully updated position' });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * Deletes an entity
 * @route DELETE /api/class/:id
 * @access Private
 * @param {string} id - class id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', auth_1.default, async (req, res) => {
    const { id } = req.params;
    try {
        await (0, classController_1.deleteEntity)(id);
        res.status(204).json({ message: 'OK' });
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
exports.default = router;
//# sourceMappingURL=entity.js.map