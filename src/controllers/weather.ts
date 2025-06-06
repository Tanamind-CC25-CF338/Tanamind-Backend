// src/controllers/weather.ts
import { Request, Response } from 'express';
import { getWeatherForecast } from '../services/weatherService';
import response from '../response';

export const fetchWeatherForecast = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return response(400, null, 'Latitude dan Longitude diperlukan', res);
    }

    const data = await getWeatherForecast(Number(lat), Number(lon));

    const grouped = data.list.reduce((acc: any[], item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!acc.find((i) => i.date === date)) {
        acc.push({
          date,
          temp: item.main.temp,
          weather: item.weather[0].main,
          icon: item.weather[0].icon,
        });
      }
      return acc;
    }, []);

    return response(
      200,
      grouped.slice(0, 4),
      'Berhasil mengambil data cuaca',
      res
    );
  } catch (err) {
    console.error('❌ Weather error:', err);
    return response(500, null, 'Gagal mengambil data cuaca', res);
  }
};
