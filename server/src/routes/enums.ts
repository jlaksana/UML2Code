import express from 'express';
import {
  createEnum,
  deleteEnum,
  editEnum,
} from '../controllers/enumController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/* POST enum given a diagram id as a parameter and enum data in body.
 * @route POST /api/enum?diagramId={diagramId}
 * @access Public
 * @returns {object} 201 - Enum object
 * @returns {Error}  400 - Could not create an enum
 * @returns {Error}  400 - Invalid - Ensure all fields are present and valid
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
    const newEnum = await createEnum(req.body, diagramId);
    res.status(201).json(newEnum);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * @route PUT /api/enum/:id?diagramId={diagramId}
 * @access Public
 * @param {string} id - enum id
 * @param {object} body - enum data
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
    const updatedEnum = await editEnum(id, diagramId, req.body);
    res.status(200).json(updatedEnum);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteEnum(id);
    res.status(204).json({ message: 'Successfully deleted enum' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
