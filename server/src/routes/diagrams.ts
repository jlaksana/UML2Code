import express from 'express';
import {
  createDiagram,
  getDiagramContents,
  getDiagramContentsPublic,
  getDiagramPrivacy,
  loginToDiagram,
  setDiagramPrivacy,
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (e) {
    res.cookie('token', '', { maxAge: 0 });
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
router.get('/:id/contents', withAuth, async (req, res) => {
  try {
    // verify requested diagramId matches with token
    if (String(req.diagramId) !== req.params.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await getDiagramContents(req.diagramId);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
    const result = await getDiagramContentsPublic(req.params.id);
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
    const diagram = await createDiagram(req.body.password);
    res.status(201).json({ id: diagram._id });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
router.get('/privacy', withAuth, async (req, res) => {
  try {
    const result = await getDiagramPrivacy(req.diagramId);
    res.status(200).json({ isPublic: result });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

router.put('/privacy', withAuth, async (req, res) => {
  try {
    await setDiagramPrivacy(req.diagramId, req.body.isPublic);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
