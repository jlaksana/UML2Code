import express from 'express';
import { createEnum, editEnum } from '../controllers/enumController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** Create enum given a diagram id as a parameter and enum data in body.
 * @route POST /api/enum?diagramId=
 * @access Public
 * @returns {object} 201 - Enum object
 * @returns {Error}  400 - Could not create an enum
 * @returns {Error}  400 - Invalid - Ensure all fields are present and valid
 */
router.post('/', withAuth, async (req, res) => {
  const { diagramId } = req.query as { diagramId: string };
  try {
    const newEnum = await createEnum(req.body, diagramId);
    res.status(201).json(newEnum);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * Edits an enum given a diagram id as a parameter and enum data in body.
 * @route PUT /api/enum/:id?diagramId=
 * @access Private
 * @param {string} id - enum id
 * @param {object} body - enum data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', withAuth, async (req, res) => {
  const { diagramId } = req.query as { diagramId: string };
  const { id } = req.params;
  try {
    const updatedEnum = await editEnum(id, diagramId, req.body);
    res.status(200).json(updatedEnum);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
