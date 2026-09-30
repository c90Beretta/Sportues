import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";
import { existsSync, mkdirSync } from "fs";

const CARPETA_CERTIFICADOS = "./uploads/certificados";
if (!existsSync(CARPETA_CERTIFICADOS)) {
  mkdirSync(CARPETA_CERTIFICADOS, { recursive: true });
}

export const certificadoMulterOptions = {
  storage: diskStorage({
    destination: "./uploads/certificados",
    filename: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const unico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unico}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (!/\.(pdf|jpg|jpeg|png)$/i.test(file.originalname)) {
      return cb(new BadRequestException("Formato de archivo no permitido"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB, igual que dice la interfaz
};