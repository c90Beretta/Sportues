import { z } from "zod";

export const asistenciaSchema = z.object({
  id: z.string().uuid(),
  estudianteId: z.string().uuid(),
  estudiante: z
    .object({
      id: z.string().uuid(),
      nombre: z.string(),
      email: z.string().email(),
    })
    .optional(),
  fecha: z.coerce.date(),
  createdAt: z.coerce.date(),
});
export type Asistencia = z.infer<typeof asistenciaSchema>;

export const registrarAsistenciaSchema = z.object({
  estudianteId: z.string().uuid().optional(),
});
export type RegistrarAsistencia = z.infer<typeof registrarAsistenciaSchema>;