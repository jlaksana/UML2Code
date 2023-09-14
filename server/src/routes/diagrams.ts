import express from 'express';
import {
  createDiagram,
  getDiagramContents,
  loginToDiagram,
} from '../controllers/diagramController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** Login to a diagram and sets cookie
 * @route POST /api/diagram/:id
 * @access Public
 * @returns {object} 200 - token as cookie
 * @returns {Error}  404 - Diagram not found
 * @returns {Error}  404 - Invalid Diagram id
 */
router.post('/:id/login', async (req, res) => {
  try {
    const token = await loginToDiagram(req.params.id, req.body.password);

    res.cookie('token', token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (e) {
    res.cookie('token', '', { maxAge: 0 });
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** GET diagram contents by id.
 * @route GET /api/diagram/contents
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
router.get('/contents', withAuth, async (req, res) => {
  try {
    const result = await getDiagramContents(req.diagramId);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
    await createDiagram(req.body.password);
    res.status(201).json({ message: 'Diagram created successfully' });
  } catch (e) {
    res.status(400).json({ message: 'Could not create a diagram' });
    console.log(getErrorMessage(e));
  }
});

export default router;
