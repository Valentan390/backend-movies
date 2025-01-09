import { rename } from 'node:fs/promises';
import * as path from 'node:path';
import { Express } from 'express';

import { UPLOAD_DIR } from '../constants/index';

export const saveFileToUploadsDir = async (
  file: Express.Multer.File,
  folder: string,
) => {
  const newPath = path.join(UPLOAD_DIR, folder, file.filename);
  await rename(file.path, newPath);
};
