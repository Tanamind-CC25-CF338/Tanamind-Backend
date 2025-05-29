import express from 'express';
import multer from 'multer';
import {
  deseaseDetection,
  getDiagnosisHistory,
  saveDiagnosis,
} from '../controllers/detection';
import uploadCloud from '../utils/multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/predict', upload.single('file'), deseaseDetection);
router.post('/save', uploadCloud.single('file'), saveDiagnosis);
router.get('/history/:userId', getDiagnosisHistory);

export default router;
