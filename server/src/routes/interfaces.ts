import express from 'express';
import {
  createInterface,
  deleteInterface,
  editInterface,
} from '../controllers/interfaceController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/* POST interface given a diagram id as a parameter and interface data in body.
 * @route POST /api/interface?diagramId={diagramId}
 * @access Public
 * @returns {object} 201 - Interface object
 * @returns {Error}  400 - Could not create an interface
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
    const newInterface = await createInterface(req.body, diagramId);
    res.status(201).json(newInterface);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * @route PUT /api/interface/:id?diagramId={diagramId}
 * @access Public
 * @param {string} id - interface id
 * @param {object} body - interface data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 * @returns {object} 200 - Updated interface object
 * @returns {Error}  400 - Could not update an interface
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
    const updatedInterface = await editInterface(id, diagramId, req.body);
    res.status(200).json(updatedInterface);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * @route DELETE /api/interface/:id
 * @access Public
 * @param {string} id - interface id
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await deleteInterface(id);
    res.status(200).json({ message: 'Interface deleted' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
