import { Request, Response } from 'express';
import { forwardToFastAPI } from '../services/inferenceService';
import { getDiagnosesByUser, saveDiagnose } from '../models/Detection';
import { getDiseaseByLabel, getDiseaseByName } from '../models/Disease';
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
    const { hasil: label, confidence } = result;

    // Cari penyakit berdasarkan label
    const disease = await getDiseaseByLabel(label);

    if (!disease) {
      return response(
        404,
        null,
        `Penyakit dengan label '${label}' tidak ditemukan.`,
        res
      );
    }

    const fullResult = {
      tanaman,
      confidence,
      disease: {
        id: disease.id,
        label: disease.label,
        name: disease.name,
        penyebab: disease.penyebab,
        deskripsi: disease.deskripsi,
        pencegahan: disease.pencegahan,
        pengendalian: disease.pengendalian,
        tanaman: disease.tanaman,
      },
    };

    return response(200, fullResult, 'Berhasil melakukan prediksi', res);
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
    const { userId, tanaman, hasil, confidence } = req.body;
    const imageUrl =
      (req.file as Express.Multer.File)?.path || req.body.imageUrl;

    if (!userId || !tanaman || !hasil || !confidence) {
      return response(400, null, 'Data tidak lengkap', res);
    }

    // Validasi bahwa tanaman sesuai enum
    const allowedTanaman = ['TOMAT', 'CABAI', 'SELADA'];
    if (!allowedTanaman.includes(tanaman)) {
      return response(400, null, 'Jenis tanaman tidak valid', res);
    }

    // Cari disease berdasarkan hasil (nama penyakit)
    const disease = await getDiseaseByName(hasil);
    if (!disease) {
      return response(404, null, 'Penyakit tidak ditemukan di database', res);
    }

    // Simpan diagnosis ke database
    const saved = await saveDiagnose({
      userId,
      tanaman,
      confidence: parseFloat(confidence),
      imageUrl,
      diseaseId: disease.id,
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
