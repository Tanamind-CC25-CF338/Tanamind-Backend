import cloudinary from '../utils/cloudinary';
import { Readable } from 'stream';

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'diagnosis_images',
        public_id: fileName.split('.')[0],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(
            new Error(
              'Cloudinary upload result is undefined or missing secure_url.'
            )
          );
        }
      }
    );
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};
