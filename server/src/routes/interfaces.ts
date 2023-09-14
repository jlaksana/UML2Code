import express from 'express';
import {
  createInterface,
  editInterface,
} from '../controllers/interfaceController';
import withAuth from '../middleware/auth';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** Creates interface given a diagram id as a parameter and interface data in body.
 * @route POST /api/interface
 * @access Private
 * @returns {object} 201 - Interface object
 * @returns {Error}  400 - Could not create an interface
 */
router.post('/', withAuth, async (req, res) => {
  // validate diagramId to be an existing diagram
  const { diagramId } = req;
  try {
    const newInterface = await createInterface(req.body, diagramId);
    res.status(201).json(newInterface);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/**
 * @route PUT /api/interface/:id
 * @access Private
 * @param {string} id - interface id
 * @param {object} body - interface data
 * @returns status 200 if successful
 * @returns status 400 if unsuccessful
 * @returns {object} 200 - Updated interface object
 * @returns {Error}  400 - Could not update an interface
 */
router.put('/:id', withAuth, async (req, res) => {
  const { diagramId } = req;
  const { id } = req.params;
  try {
    const updatedInterface = await editInterface(id, diagramId, req.body);
    res.status(200).json(updatedInterface);
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
