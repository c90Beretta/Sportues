import { z } from "zod";
export const ejercicioEnRutinaSchema = z.object({
    ejercicioId: z.string().uuid(),
    series: z.number().int().positive(),
    repeticiones: z.number().int().positive(),
    descansoSegundos: z.number().int().nonnegative().optional(),
});
export const rutinaSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(1),
    descripcion: z.string().nullable(),
    estudianteId: z.string().uuid(),
    estudiante: z
        .object({
        id: z.string().uuid(),
        nombre: z.string(),
        email: z.string().email(),
    })
        .optional(),
    ejercicios: z.array(ejercicioEnRutinaSchema.and(z.object({
        nombre: z.string().optional(),
    }))),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export const crearRutinaSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().nullable().optional(),
    estudianteId: z.string().uuid(),
    ejercicios: z.array(ejercicioEnRutinaSchema).min(1),
});
//# sourceMappingURL=rutinas.js.map