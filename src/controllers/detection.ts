import { Request, Response } from 'express';
import { forwardToFastAPI } from '../services/inferenceService';
import path from 'path';

export const deseaseDetection = async (req: Request, res: Response) => {
  try {
    const tanaman = req.body.tanaman;
    const filePath = req.file?.path;

    if (!filePath || !tanaman) {
      res.status(400).json({ message: 'File dan tanaman harus diisi.' });
      return;
    }

    const result = await forwardToFastAPI(filePath, tanaman);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat prediksi.' });
  }
};
