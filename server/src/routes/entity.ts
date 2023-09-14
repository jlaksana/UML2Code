import express from 'express';
import { deleteEntity, updatePosition } from '../controllers/classController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/**
 * Edits an entity's position in the diagram
 * @route PUT /api/entity/:id/position
 * @access Private
 * @param {string} id - class id
 * @param {object} body - class data
 * @returns status 204 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/position', withAuth, async (req, res) => {
  const { id } = req.params;
  const position = req.body;
  try {
    await updatePosition(id, position);
    res.status(204).json({ message: 'Successfully updated position' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * Deletes an entity
 * @route DELETE /api/class/:id
 * @access Private
 * @param {string} id - class id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteEntity(id);
    res.status(204).json({ message: 'OK' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

export default router;
