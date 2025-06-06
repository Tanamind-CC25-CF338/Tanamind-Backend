import { Request, Response } from 'express';
import { getWeatherByCoords } from '../services/weatherService';
import response from '../response';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return response(400, null, 'Latitude dan longitude wajib diisi', res);
    }

    const weather = await getWeatherByCoords(Number(lat), Number(lon));
    return response(200, weather, 'Berhasil mengambil data cuaca', res);
  } catch (err) {
    console.error('❌ Weather error:', err);
    return response(500, null, 'Gagal mengambil data cuaca', res);
  }
};
