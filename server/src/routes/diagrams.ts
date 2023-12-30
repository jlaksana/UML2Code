import express from 'express';
import {
  createDiagram,
  deleteDiagram,
  getDiagramContents,
  getDiagramContentsPublic,
  getDiagramPrivacy,
  getDiagramsForUser,
  renameDiagram,
  setDiagramPrivacy,
} from '../controllers/diagramController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** GET all diagrams for a user
 * @route GET /api/diagram
 * @access Private
 * @returns {object} 200 - list of Diagram object
 */
router.get('/', withAuth, async (req, res) => {
  try {
    const diagrams = await getDiagramsForUser(req.userId);
    res.status(200).json(diagrams);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
router.get('/:diagramId/contents', withAuth, async (req, res) => {
  try {
    const result = await getDiagramContents(req.params.diagramId);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
    const result = await getDiagramContentsPublic(req.params.diagramId);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Creates a diagram
 * @route POST /api/diagram
 * @access Public
 * @returns {object} 201 - Diagram object
 * @returns {Error}  400 - Could not create a diagram
 * @example response - 200 - Success message
 */
router.post('/', withAuth, async (req, res) => {
  try {
    const diagram = await createDiagram(req.body.userId);
    res.status(201).json({ id: diagram._id });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
router.put('/:diagramId/rename', withAuth, async (req, res) => {
  try {
    await renameDiagram(req.params.diagramId, req.body.name);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
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
router.get('/:diagramId/privacy', withAuth, async (req, res) => {
  try {
    const result = await getDiagramPrivacy(req.params.diagramId);
    res.status(200).json({ isPublic: result });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * sets the privacy of a diagram to public or private
 * @route PUT /api/diagram/:diagramId/privacy
 * @access Private
 */
router.put('/:diagramId/privacy', withAuth, async (req, res) => {
  try {
    await setDiagramPrivacy(req.params.diagramId, req.body.isPublic);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

router.delete('/:diagramId', withAuth, async (req, res) => {
  try {
    await deleteDiagram(req.params.diagramId);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    res.status(404).json({ message: 'Could not delete diagram' });
    console.log(getErrorMessage(e));
  }
});

export default router;
