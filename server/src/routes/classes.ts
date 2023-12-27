import express from 'express';
import { createClass, editClass } from '../controllers/classController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** Create class given a diagram id as a parameter and class data in body.
 * @route POST /api/class?diagramId=
 * @access Private
 * @returns {object} 201 - Class object
 * @returns {Error}  400 - Could not create a class
 */
router.post('/', withAuth, async (req, res) => {
  const { diagramId } = req.query as { diagramId: string };
  try {
    const newClass = await createClass(req.body, diagramId);
    res.status(201).json(newClass);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

/**
 * @route PUT /api/class/:id?diagramId=
 * @access Private
 * @param {string} id - class id
 * @param {object} body - class data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 */
router.put('/:id', withAuth, async (req, res) => {
  const { diagramId } = req.query as { diagramId: string };
  const { id } = req.params;
  try {
    const updatedClass = await editClass(id, diagramId, req.body);
    res.status(200).json(updatedClass);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(e);
  }
});

export default router;
