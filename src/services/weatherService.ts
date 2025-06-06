import axios from 'axios';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY!;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const res = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: 'metric',
    },
  });

  const { weather, main, wind } = res.data;

  return {
    temperature: main.temp,
    humidity: main.humidity,
    condition: weather[0].main,
    wind_speed: wind.speed,
    description: weather[0].description,
  };
};
