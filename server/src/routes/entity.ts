import express from 'express';
import { deleteEntity, updatePosition } from '../controllers/classController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/**
 * @route PUT /api/entity/:id/position
 * @access Public
 * @param {string} id - class id
 * @param {object} body - class data
 * @returns status 204 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id/position', async (req, res) => {
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
 * @route DELETE /api/class/:id
 * @access Public
 * @param {string} id - class id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', async (req, res) => {
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
