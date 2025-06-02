import { Router } from 'express';
import {
  getDiseases,
  getDiseaseDetailById,
  getDiseaseDetailByName,
} from '../controllers/disease';

const router = Router();

router.get('/', getDiseases);
router.get('/:id', getDiseaseDetailById);
router.get('/name/:name', getDiseaseDetailByName);

export default router;
