import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'diagnosis_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `img-${Date.now()}`,
  }),
});

const uploadCloud = multer({ storage });

export default uploadCloud;
