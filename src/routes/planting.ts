import express from 'express';
import {
  completePlanting,
  getUserPlantings,
  startPlanting,
} from '../controllers/planting';

const router = express.Router();

router.post('/start', startPlanting);
router.get('/:userId', getUserPlantings);
router.patch('/:id/complete', completePlanting);

export default router;
