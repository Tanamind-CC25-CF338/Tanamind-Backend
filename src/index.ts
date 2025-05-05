import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Server is working!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
