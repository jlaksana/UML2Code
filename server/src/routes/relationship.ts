import express from 'express';
import { createRelationship } from '../controllers/relationshipController';
import { getErrorMessage } from '../utils';

const router = express.Router();

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

export default router;
