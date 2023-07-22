import express from 'express';
import {
  createDiagram,
  findDiagramById,
  getDiagramContents,
} from '../controllers/diagramController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/* GET diagram listing by id.
 * @route GET /api/diagram/:id
 * @access Public
 * @returns {object} 200 - Diagram object
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 * @example response - 200 - Diagram object
 * {
 *   "id": "1000",
 * }
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await findDiagramById(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/* GET diagram contents by id.
 * @route GET /api/diagram/:id/contents
 * @access Public
 * @returns {object} 200 - Diagram contents object
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 * @example response - 200 - Diagram contents object
 * {
 *  "diagramId": "1000",
 *  "entities": {
 *   "classes": []
 *  "interfaces": []
 *  "enums": []
 * },
 * "relationships": []
 */
router.get('/:id/contents', async (req, res) => {
  try {
    const result = await getDiagramContents(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/* POST diagram.
 * @route POST /api/diagram
 * @access Public
 * @returns {object} 201 - Diagram object
 * @returns {Error}  400 - Could not create a diagram
 * @example response - 200 - Diagram object
 * {
 *  "id": "1000",
 * }
 */
router.post('/', async (req, res) => {
  try {
    const result = await createDiagram();
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: 'Could not create a diagram' });
    console.log(getErrorMessage(e));
  }
});

export default router;
