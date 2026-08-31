import { z } from "zod";
export declare const membresiaSchema: z.ZodObject<{
    id: z.ZodString;
    nombre: z.ZodString;
    descripcion: z.ZodNullable<z.ZodString>;
    precio: z.ZodNumber;
    duracionDias: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    precio: number;
    duracionDias: number;
}, {
    id: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    precio: number;
    duracionDias: number;
}>;
export type Membresia = z.infer<typeof membresiaSchema>;
export declare const crearMembresiaSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    nombre: z.ZodString;
    descripcion: z.ZodNullable<z.ZodString>;
    precio: z.ZodNumber;
    duracionDias: z.ZodNumber;
    createdAt: z.ZodDate;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracionDias: number;
}, {
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracionDias: number;
}>;
export type CrearMembresia = z.infer<typeof crearMembresiaSchema>;
