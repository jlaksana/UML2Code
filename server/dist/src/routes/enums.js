"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enumController_1 = require("../controllers/enumController");
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
/** Create enum given a diagram id as a parameter and enum data in body.
 * @route POST /api/enum
 * @access Public
 * @returns {object} 201 - Enum object
 * @returns {Error}  400 - Could not create an enum
 * @returns {Error}  400 - Invalid - Ensure all fields are present and valid
 */
router.post('/', auth_1.default, async (req, res) => {
    const { diagramId } = req;
    try {
        const newEnum = await (0, enumController_1.createEnum)(req.body, diagramId);
        res.status(201).json(newEnum);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * Edits an enum given a diagram id as a parameter and enum data in body.
 * @route PUT /api/enum/:id
 * @access Private
 * @param {string} id - enum id
 * @param {object} body - enum data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', auth_1.default, async (req, res) => {
    const { diagramId } = req;
    const { id } = req.params;
    try {
        const updatedEnum = await (0, enumController_1.editEnum)(id, diagramId, req.body);
        res.status(200).json(updatedEnum);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
exports.default = router;
//# sourceMappingURL=enums.js.map