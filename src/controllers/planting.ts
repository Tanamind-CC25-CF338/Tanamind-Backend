import { Request, Response } from 'express';
import {
  createPlanting,
  getPlantingsByUser,
  markPlantingAsDone,
} from '../models/Users';
import response from '../response';

export const startPlanting = async (req: Request, res: Response) => {
  try {
    const { userId, tanaman } = req.body;
    if (!userId || !tanaman)
      return response(400, null, 'UserId dan tanaman wajib diisi', res);
    const planting = await createPlanting(userId, tanaman);
    return response(201, planting, 'Berhasil memulai penanaman', res);
  } catch (err) {
    console.error('❌ Gagal memulai penanaman:', err);
    return response(500, null, 'Terjadi kesalahan server', res);
  }
};

export const getUserPlantings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const list = await getPlantingsByUser(userId);
    return response(200, list, 'Berhasil mengambil daftar penanaman', res);
  } catch (err) {
    console.error('❌ Gagal ambil daftar penanaman:', err);
    return response(500, null, 'Terjadi kesalahan server', res);
  }
};

export const completePlanting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await markPlantingAsDone(id);
    return response(200, result, 'Berhasil menyelesaikan penanaman', res);
  } catch (err) {
    console.error('❌ Gagal menyelesaikan penanaman:', err);
    return response(500, null, 'Terjadi kesalahan server', res);
  }
};
