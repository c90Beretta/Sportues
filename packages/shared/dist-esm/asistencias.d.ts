import { z } from "zod";
export declare const asistenciaSchema: z.ZodObject<{
    id: z.ZodString;
    estudianteId: z.ZodString;
    estudiante: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        nombre: z.ZodString;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        nombre: string;
        email: string;
    }, {
        id: string;
        nombre: string;
        email: string;
    }>>;
    fecha: z.ZodDate;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    estudianteId: string;
    fecha: Date;
    createdAt: Date;
    estudiante?: {
        id: string;
        nombre: string;
        email: string;
    } | undefined;
}, {
    id: string;
    estudianteId: string;
    fecha: Date;
    createdAt: Date;
    estudiante?: {
        id: string;
        nombre: string;
        email: string;
    } | undefined;
}>;
export type Asistencia = z.infer<typeof asistenciaSchema>;
export declare const registrarAsistenciaSchema: z.ZodObject<{
    estudianteId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    estudianteId?: string | undefined;
}, {
    estudianteId?: string | undefined;
}>;
export type RegistrarAsistencia = z.infer<typeof registrarAsistenciaSchema>;
