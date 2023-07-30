import express from 'express';
import {
  createClass,
  deleteClass,
  editClass,
} from '../controllers/classController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/* POST class given a diagram id as a parameter and class data in body.
 * @route POST /api/class?diagramId={diagramId}
 * @access Public
 * @returns {object} 201 - Class object
 * @returns {Error}  400 - Could not create a class
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
    const newClass = await createClass(req.body, diagramId);
    res.status(201).json(newClass);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * @route PUT /api/class/:id?diagramId={diagramId}
 * @access Public
 * @param {string} id - class id
 * @param {object} body - class data
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
    const updatedClass = await editClass(id, diagramId, req.body);
    res.status(204).json(updatedClass);
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
    await deleteClass(id);
    res.status(204).json({ message: 'OK' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
