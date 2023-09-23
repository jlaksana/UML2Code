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
/** Create class given a diagram id as a parameter and class data in body.
 * @route POST /api/class
 * @access Private
 * @returns {object} 201 - Class object
 * @returns {Error}  400 - Could not create a class
 */
router.post('/', auth_1.default, async (req, res) => {
    const { diagramId } = req;
    try {
        const newClass = await (0, classController_1.createClass)(req.body, diagramId);
        res.status(201).json(newClass);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
/**
 * @route PUT /api/class/:id
 * @access Private
 * @param {string} id - class id
 * @param {object} body - class data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', auth_1.default, async (req, res) => {
    const { diagramId } = req;
    const { id } = req.params;
    try {
        const updatedClass = await (0, classController_1.editClass)(id, diagramId, req.body);
        res.status(200).json(updatedClass);
    }
    catch (e) {
        res.status(400).json({ message: (0, utils_1.getErrorMessage)(e) });
        console.log(e);
    }
});
exports.default = router;
//# sourceMappingURL=classes.js.map