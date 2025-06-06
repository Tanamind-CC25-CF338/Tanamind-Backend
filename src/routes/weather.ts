import express from 'express';
import { fetchWeatherForecast } from '../controllers/weather';

const router = express.Router();

router.get('/weather', fetchWeatherForecast);

export default router;
