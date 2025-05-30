import express from 'express';
import multer from 'multer';
import {
  deseaseDetection,
  getDiagnosisHistory,
  saveDiagnosis,
} from '../controllers/detection';
import uploadCloud from '../utils/multer';

const router = express.Router();

router.post('/predict', uploadCloud.single('file'), deseaseDetection);
router.post('/save', saveDiagnosis); // 🔥 Tidak perlu upload ulang
router.get('/history/:userId', getDiagnosisHistory);

export default router;
