import express from 'express';
import {
  createRelationship,
  deleteRelationship,
  editRelationship,
  editRelationshipHandle,
  getRelationship,
} from '../controllers/relationshipController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/**
 * GET a relationship given an id
 * @route GET /api/relationship/:id?diagramId={diagramId}
 * @access Public
 * @param {string} id - relationship id
 * @returns {object} 200 - Relationship object
 */
router.get('/:id', async (req, res) => {
  const { diagramId } = req.query;
  if (!diagramId || typeof diagramId !== 'string') {
    res.status(400).json({ message: 'Missing diagram id' });
    console.log('Missing diagram id');
    return;
  }

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

/* POST relationship given a diagram id as a parameter and relationship data in body.
 * @route POST /api/relationship?diagramId={diagramId}
 * @access Public
 * @returns {object} 201 - Relationship object
 * @returns {Error}  400 - Could not create a relationship
 * @returns {Error}  400 - Missing diagram id
 */
router.post('/', async (req, res) => {
  // validate diagramId to be an existing diagram
  const { diagramId } = req.query;
  if (!diagramId || typeof diagramId !== 'string') {
    res.status(400).json({ message: 'Missing diagram id' });
    console.log('Missing diagram id');
    return;
  }

  try {
    const newRelationship = await createRelationship(req.body, diagramId);
    res.status(201).json(newRelationship);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * PUT relationship given a relationship id as a parameter and relationship data in body
 * @route PUT /api/relationship/:id?diagramId={diagramId}
 * @access Public
 * @param {string} id - relationship id
 * @param {object} body - relationship data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', async (req, res) => {
  const { diagramId } = req.query;
  const { id } = req.params;

  if (!diagramId || typeof diagramId !== 'string') {
    res.status(400).json({ message: 'Missing diagram id' });
    console.log('Missing diagram id');
    return;
  }
  try {
    const updatedRelationship = await editRelationship(id, diagramId, req.body);
    res.status(200).json(updatedRelationship);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * PUT relationship handles given a relationship id as a parameter and handle data in body
 * @route PUT /api/relationship/:id/handle?diagramId={diagramId}
 * @access Public
 * @param {string} id - relationship id
 * @param {object} body - handle update data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/handle', async (req, res) => {
  const { diagramId } = req.query;
  const { id } = req.params;

  if (!diagramId || typeof diagramId !== 'string') {
    res.status(400).json({ message: 'Missing diagram id' });
    console.log('Missing diagram id');
    return;
  }
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
 * @access Public
 * @param {string} id - relationship id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', async (req, res) => {
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
