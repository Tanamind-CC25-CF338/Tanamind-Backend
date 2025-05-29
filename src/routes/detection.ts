import express from 'express';
import multer from 'multer';
import {
  deseaseDetection,
  getDiagnosisHistory,
  saveDiagnosis,
} from '../controllers/detection';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/predict', upload.single('file'), deseaseDetection);
router.post('/save', saveDiagnosis);
router.get('/history/:userId', getDiagnosisHistory);

export default router;
