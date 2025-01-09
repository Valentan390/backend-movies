import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index';
import { Request } from 'express';

export const multerConfig = {
  storage: diskStorage({
    destination: TEMP_UPLOAD_DIR,
    filename: (req, file, callback) => {
      const filename = `${Date.now()}_${file.originalname}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, arg1: boolean) => void,
  ) => {
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (extension === 'exe') {
      return callback(
        new BadRequestException('.exe not allowed extension'),
        false,
      );
    }
    callback(null, true);
  },
};
