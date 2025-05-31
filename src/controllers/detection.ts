import { Request, Response } from 'express';
import { forwardToFastAPI } from '../services/inferenceService';
import { getDiagnosesByUser, saveDiagnose } from '../models/Detection';
import { getDiseaseByLabel, getDiseaseByName } from '../models/Disease';
import response from '../response';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { uploadBufferToCloudinary } from '../helper/cloudinaryUploader';

export const deseaseDetection = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tanaman = req.body.tanaman;
  const file = req.file;

  if (!file || !tanaman) {
    return response(400, null, 'File dan tanaman harus diisi.', res);
  }

  let tempFilePath: string | undefined;
  let tempDir: string | undefined;

  try {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tanamind-predict-'));
    const extension = path.extname(file.originalname) || '.tmp';
    tempFilePath = path.join(tempDir, `image-${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, file.buffer);

    const result = await forwardToFastAPI(tempFilePath, tanaman);
    const { hasil: label, confidence } = result;

    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
    tempFilePath = undefined;
    tempDir = undefined;

    if (confidence < 0.9) {
      return response(
        200,
        {
          tanaman,
          confidence,
          disease: null,
        },
        'Penyakit tidak ditemukan atau tingkat kepercayaan rendah.',
        res
      );
    }

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
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkErr) {
        console.error('❌ Error deleting temporary file on error:', unlinkErr);
      }
    }
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmdirSync(tempDir);
      } catch (rmdirErr) {
        console.error(
          '❌ Error deleting temporary directory on error:',
          rmdirErr
        );
      }
    }
  }
};

export const saveDiagnosis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, tanaman, hasil, confidence } = req.body;
    const fileToUpload = req.file;

    if (!userId || !tanaman || !hasil || !confidence) {
      return response(
        400,
        null,
        'Data diagnosis tidak lengkap (memerlukan userId, tanaman, hasil, confidence)',
        res
      );
    }

    if (!fileToUpload) {
      return response(400, null, 'File gambar diperlukan untuk disimpan.', res);
    }

    const allowedTanaman = ['TOMAT', 'CABAI', 'SELADA'];
    if (!allowedTanaman.includes(tanaman.toUpperCase())) {
      return response(400, null, 'Jenis tanaman tidak valid', res);
    }

    const disease = await getDiseaseByName(hasil);
    if (!disease) {
      return response(404, null, 'Penyakit tidak ditemukan di database', res);
    }

    const uniqueFileName = `img-${Date.now()}-${fileToUpload.originalname}`;
    const imageUrl = await uploadBufferToCloudinary(
      fileToUpload.buffer,
      uniqueFileName
    );

    const saved = await saveDiagnose({
      userId,
      tanaman: tanaman.toUpperCase() as 'TOMAT' | 'CABAI' | 'SELADA',
      confidence: parseFloat(confidence),
      imageUrl,
      diseaseId: disease.id,
    });

    return response(
      201,
      saved,
      'Diagnosis berhasil disimpan beserta gambar',
      res
    );
  } catch (err) {
    console.error('❌ Failed to save diagnosis:', err);
    if (err instanceof Error && err.message.includes('Cloudinary')) {
      return response(
        500,
        null,
        `Gagal mengunggah gambar ke Cloudinary: ${err.message}`,
        res
      );
    }
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
    console.log(history);
    return response(200, history, 'Riwayat diagnosis berhasil diambil', res);
  } catch (err) {
    console.error('❌ Failed to get history:', err);
    return response(500, null, 'Gagal mengambil riwayat diagnosis.', res);
  }
};
