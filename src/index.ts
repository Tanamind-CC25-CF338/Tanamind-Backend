import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// place to handle all routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Server is working!');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
