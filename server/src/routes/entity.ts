import express from 'express';
import { updatePosition } from '../controllers/classController';
import { getErrorMessage } from '../utils';

const router = express.Router();

router.put('/:id/position', async (req, res) => {
  const { id } = req.params;
  const position = req.body;
  try {
    await updatePosition(id, position);
    res.status(200).json({ message: 'Successfully updated position' });
  } catch (e) {
    res.status(400).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
