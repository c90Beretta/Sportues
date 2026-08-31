import { z } from "zod";
export const ejercicioSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(1),
    descripcion: z.string().nullable(),
    grupoMuscular: z.string().nullable(),
    createdAt: z.coerce.date(),
});
export const crearEjercicioSchema = ejercicioSchema.omit({ id: true, createdAt: true });
//# sourceMappingURL=ejercicios.js.map