// src/services/weatherService.ts
import axios from 'axios';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY!;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherForecast = async (lat: number, lon: number) => {
  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      units: 'metric',
      cnt: 32, // forecast 3 jam * 32 = 4 hari
      appid: WEATHER_API_KEY,
    },
  });

  return res.data;
};
