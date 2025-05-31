import express from 'express';
import multer from 'multer';
import {
  deseaseDetection,
  getDiagnosisHistory,
  saveDiagnosis,
} from '../controllers/detection';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/predict', upload.single('file'), deseaseDetection);
router.post('/save', upload.single('file'), saveDiagnosis);
router.get('/history/:userId', getDiagnosisHistory);

export default router;
