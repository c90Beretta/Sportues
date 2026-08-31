import { z } from "zod";
export declare const ejercicioSchema: z.ZodObject<{
    id: z.ZodString;
    nombre: z.ZodString;
    descripcion: z.ZodNullable<z.ZodString>;
    grupoMuscular: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    grupoMuscular: string | null;
}, {
    id: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    grupoMuscular: string | null;
}>;
export type Ejercicio = z.infer<typeof ejercicioSchema>;
export declare const crearEjercicioSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    nombre: z.ZodString;
    descripcion: z.ZodNullable<z.ZodString>;
    grupoMuscular: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    nombre: string;
    descripcion: string | null;
    grupoMuscular: string | null;
}, {
    nombre: string;
    descripcion: string | null;
    grupoMuscular: string | null;
}>;
export type CrearEjercicio = z.infer<typeof crearEjercicioSchema>;
