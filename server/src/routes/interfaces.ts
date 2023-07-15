import express from 'express';
import { createInterface } from '../controllers/interfaceController';
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

export default router;
