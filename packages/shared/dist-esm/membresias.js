import { z } from "zod";
export const membresiaSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(1),
    descripcion: z.string().nullable(),
    precio: z.number().nonnegative(),
    duracionDias: z.number().int().positive(),
    createdAt: z.coerce.date(),
});
export const crearMembresiaSchema = membresiaSchema.omit({ id: true, createdAt: true });
//# sourceMappingURL=membresias.js.map