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
  entrenadorEnTurnoId: z.string().uuid().nullable(),
  horaEntrada: z.coerce.date(),
  horaSalida: z.coerce.date().nullable(),
  cerradaAutomaticamente: z.boolean(),
});
export type Asistencia = z.infer<typeof asistenciaSchema>;

export const registrarAsistenciaSchema = z.object({
  estudianteId: z.string().uuid().optional(),
});
export type RegistrarAsistencia = z.infer<typeof registrarAsistenciaSchema>;