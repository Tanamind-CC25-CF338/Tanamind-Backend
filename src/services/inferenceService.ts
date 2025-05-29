import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const forwardToFastAPI = async (filePath: string, tanaman: string) => {
  const form = new FormData();
  form.append('tanaman', tanaman);
  form.append('file', fs.createReadStream(filePath));

  const serverModelUrl = process.env.MODEL_SERVER_URL!;

  const response = await axios.post(`${serverModelUrl}/predict`, form, {
    headers: form.getHeaders(),
  });

  return response.data;
};
