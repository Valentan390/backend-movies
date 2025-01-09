import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'node:fs/promises';
import { env } from './env.js';
import { InternalServerErrorException } from '@nestjs/common';

const cloud_name = env('CLOUDINARY_CLOUD_NAME');
const api_key = env('CLOUDINARY_API_KEY');
const api_secret = env('CLOUDINARY_API_SECRET');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file: Express.Multer.File) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file.path, {
      folder: 'posters',
    });
    await unlink(file.path);
    return secure_url;
  } catch (error) {
    await unlink(file.path);
    throw new InternalServerErrorException(error.message);
  }
};
