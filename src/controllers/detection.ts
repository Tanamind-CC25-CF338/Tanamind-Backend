import { Request, Response } from 'express';
import { forwardToFastAPI } from '../services/inferenceService';
import { getDiagnosesByUser, saveDiagnose } from '../models/Detection';
import response from '../response';

export const deseaseDetection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tanaman = req.body.tanaman;
    const filePath = req.file?.path;

    if (!filePath || !tanaman) {
      return response(400, null, 'File dan tanaman harus diisi.', res);
    }

    const result = await forwardToFastAPI(filePath, tanaman);
    return response(200, result, 'Berhasil melakukan prediksi', res);
  } catch (err) {
    console.error('❌ Error in deseaseDetection:', err);
    return response(500, null, 'Terjadi kesalahan saat prediksi.', res);
  }
};

export const saveDiagnosis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, tanaman, hasil, confidence, ciri, solusi } = req.body;
    const imageUrl =
      (req.file as Express.Multer.File)?.path || req.body.imageUrl;

    if (!userId || !tanaman || !hasil || !confidence || !ciri || !solusi) {
      return response(400, null, 'Data tidak lengkap', res);
    }

    const saved = await saveDiagnose({
      userId,
      tanaman,
      hasil,
      confidence: parseFloat(confidence),
      ciri: Array.isArray(ciri) ? ciri : [ciri],
      solusi: Array.isArray(solusi) ? solusi : [solusi],
      imageUrl,
    });

    return response(201, saved, 'Diagnosis berhasil disimpan', res);
  } catch (err) {
    console.error('❌ Failed to save diagnosis:', err);
    return response(500, null, 'Gagal menyimpan diagnosis.', res);
  }
};

export const getDiagnosisHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const history = await getDiagnosesByUser(userId);
    return response(200, history, 'Riwayat diagnosis berhasil diambil', res);
  } catch (err) {
    console.error('❌ Failed to get history:', err);
    return response(500, null, 'Gagal mengambil riwayat diagnosis.', res);
  }
};
