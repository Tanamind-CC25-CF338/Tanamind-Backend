import { Request, Response } from 'express';
import { forwardToFastAPI } from '../services/inferenceService';
import { getDiagnosesByUser, saveDiagnose } from '../models/Detection';

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

export const saveDiagnosis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, tanaman, hasil, confidence, ciri, solusi, imageUrl } =
      req.body;

    if (!userId || !tanaman || !hasil || !confidence || !ciri || !solusi) {
      res.status(400).json({ message: 'Data tidak lengkap' });
      return;
    }

    const saved = await saveDiagnose({
      userId,
      tanaman,
      hasil,
      confidence: parseFloat(confidence),
      ciri,
      solusi,
      imageUrl,
    });

    res
      .status(201)
      .json({ message: 'Diagnosis berhasil disimpan', data: saved });
  } catch (err) {
    console.error('❌ Failed to save diagnosis:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDiagnosisHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const history = await getDiagnosesByUser(userId);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve diagnosis history' });
  }
};
