import express from 'express';
import {
  createRelationship,
  deleteRelationship,
  editRelationship,
  editRelationshipHandle,
  getRelationship,
} from '../controllers/relationshipController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/**
 * GET a relationship given an id
 * @route GET /api/relationship/:id
 * @access Private
 * @param {string} id - relationship id
 * @returns {object} 200 - Relationship object
 */
router.get('/:id', withAuth, async (req, res) => {
  const { diagramId } = req;
  try {
    const relationship = await getRelationship(req.params.id, diagramId);
    if (!relationship) {
      throw new Error();
    }
    res.status(200).json(relationship);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
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
router.post('/', withAuth, async (req, res) => {
  // validate diagramId to be an existing diagram
  const { diagramId } = req;
  try {
    const newRelationship = await createRelationship(req.body, diagramId);
    res.status(201).json(newRelationship);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * Edit relationship given a relationship id as a parameter and relationship data in body
 * @route PUT /api/relationship/:id
 * @access Private
 * @param {string} id - relationship id
 * @param {object} body - relationship data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', withAuth, async (req, res) => {
  const { diagramId } = req;
  const { id } = req.params;
  try {
    const updatedRelationship = await editRelationship(id, diagramId, req.body);
    res.status(200).json(updatedRelationship);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * Edit relationship handles given a relationship id as a parameter and handle data in body
 * @route PUT /api/relationship/:id/handle
 * @access Private
 * @param {string} id - relationship id
 * @param {object} body - handle update data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/handle', withAuth, async (req, res) => {
  const { diagramId } = req;
  const { id } = req.params;
  try {
    await editRelationshipHandle(id, diagramId, req.body);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * @route DELETE /api/relationship/:id
 * @access Private
 * @param {string} id - relationship id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteRelationship(id);
    res.status(204).json({ message: 'OK' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

export default router;
