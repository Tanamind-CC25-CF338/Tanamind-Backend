import { Request, Response } from 'express';
import {
  getAllDiseases,
  getDiseaseById,
  getDiseaseByName,
} from '../models/Disease';
import response from '../response';

export const getDiseases = async (req: Request, res: Response) => {
  try {
    const diseases = await getAllDiseases();
    return response(200, diseases, 'Berhasil mengambil data penyakit', res);
  } catch (err) {
    console.error('❌ Failed to get diseases:', err);
    return response(500, null, 'Gagal mengambil data penyakit', res);
  }
};

export const getDiseaseDetailById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const disease = await getDiseaseById(id);
    if (!disease) {
      return response(404, null, 'Penyakit tidak ditemukan', res);
    }
    return response(200, disease, 'Berhasil mengambil detail penyakit', res);
  } catch (err) {
    console.error('❌ Failed to get disease by id:', err);
    return response(500, null, 'Gagal mengambil detail penyakit', res);
  }
};

export const getDiseaseDetailByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const disease = await getDiseaseByName(name);
    if (!disease) {
      return response(404, null, 'Penyakit tidak ditemukan', res);
    }
    return response(200, disease, 'Berhasil mengambil data penyakit', res);
  } catch (err) {
    console.error('❌ Failed to get disease by name:', err);
    return response(500, null, 'Gagal mengambil data penyakit', res);
  }
};
