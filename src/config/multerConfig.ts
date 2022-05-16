import { Request } from 'express';
import * as multer from 'multer';
import * as path from 'path';

function createFilename(file: Express.Multer.File) {
  return path.basename(Date.now() + file.originalname);
}

export const multerConfig = {
  storage: multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: CallableFunction) {
      cb(null, 'uploads/');
    },
    filename(req: Request, file: Express.Multer.File, cb: CallableFunction) {
      cb(null, createFilename(file));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};
