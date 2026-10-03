import { z } from "zod";

export const nivelRutinaSchema = z.enum(["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"]);
export type NivelRutina = z.infer<typeof nivelRutinaSchema>;

export const origenRutinaSchema = z.enum(["OFICIAL", "PERSONAL"]);
export type OrigenRutina = z.infer<typeof origenRutinaSchema>;

export const ejercicioEnRutinaSchema = z.object({
  ejercicioId: z.string().uuid(),
  orden: z.number().int().nonnegative(),
  series: z.number().int().positive(),
  repeticiones: z.number().int().positive(),
  descansoSegundos: z.number().int().nonnegative().optional(),
});
export type EjercicioEnRutina = z.infer<typeof ejercicioEnRutinaSchema>;

export const rutinaSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  origen: origenRutinaSchema,
  nivel: nivelRutinaSchema.nullable(),
  descripcion: z.string().nullable(),
  gruposMusculares: z.array(z.string()),
  creadaPorId: z.string().uuid(),
  creadaPor: z
    .object({
      id: z.string().uuid(),
      nombre: z.string(),
      email: z.string().email(),
    })
    .optional(),
  ejercicios: z.array(
    ejercicioEnRutinaSchema.and(
      z.object({
        nombre: z.string().optional(),
      }),
    ),
  ),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Rutina = z.infer<typeof rutinaSchema>;

export const crearRutinaSchema = z.object({
  nombre: z.string().min(1),
  origen: origenRutinaSchema.optional(),
  nivel: nivelRutinaSchema.nullable().optional(),
  descripcion: z.string().nullable().optional(),
  gruposMusculares: z.array(z.string()).optional(),
  creadaPorId: z.string().uuid(),
  ejercicios: z.array(ejercicioEnRutinaSchema.omit({ orden: true })).min(1),
});
export type CrearRutina = z.infer<typeof crearRutinaSchema>;