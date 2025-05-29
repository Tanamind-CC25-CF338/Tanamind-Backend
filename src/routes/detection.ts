import express from 'express';
import multer from 'multer';
import { deseaseDetection } from '../controllers/detection';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/predict', upload.single('file'), deseaseDetection);

export default router;
