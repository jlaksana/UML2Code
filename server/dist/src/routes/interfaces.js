"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interfaceController_1 = require("../controllers/interfaceController");
const auth_1 = __importDefault(require("../middleware/auth"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
/** Creates interface given a diagram id as a parameter and interface data in body.
 * @route POST /api/interface?diagramId=
 * @access Private
 * @returns {object} 201 - Interface object
 * @returns {Error}  400 - Could not create an interface
 */
router.post('/', auth_1.default, async (req, res) => {
    // validate diagramId to be an existing diagram
    const { diagramId } = req.query;
    try {
        const newInterface = await (0, interfaceController_1.createInterface)(req.body, diagramId);
        res.status(201).json(newInterface);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
/**
 * @route PUT /api/interface/:id?diagramId=
 * @access Private
 * @param {string} id - interface id
 * @param {object} body - interface data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 * @returns {object} 200 - Updated interface object
 * @returns {Error}  400 - Could not update an interface
 */
router.put('/:id', auth_1.default, async (req, res) => {
    const { diagramId } = req.query;
    const { id } = req.params;
    try {
        const updatedInterface = await (0, interfaceController_1.editInterface)(id, diagramId, req.body);
        res.status(200).json(updatedInterface);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log((0, utils_1.getErrorMessage)(e));
    }
});
exports.default = router;
//# sourceMappingURL=interfaces.js.map