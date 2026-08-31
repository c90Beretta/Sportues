import { z } from "zod";
export declare const ejercicioEnRutinaSchema: z.ZodObject<{
    ejercicioId: z.ZodString;
    series: z.ZodNumber;
    repeticiones: z.ZodNumber;
    descansoSegundos: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    ejercicioId: string;
    series: number;
    repeticiones: number;
    descansoSegundos?: number | undefined;
}, {
    ejercicioId: string;
    series: number;
    repeticiones: number;
    descansoSegundos?: number | undefined;
}>;
export type EjercicioEnRutina = z.infer<typeof ejercicioEnRutinaSchema>;
export declare const rutinaSchema: z.ZodObject<{
    id: z.ZodString;
    nombre: z.ZodString;
    descripcion: z.ZodNullable<z.ZodString>;
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
    ejercicios: z.ZodArray<z.ZodIntersection<z.ZodObject<{
        ejercicioId: z.ZodString;
        series: z.ZodNumber;
        repeticiones: z.ZodNumber;
        descansoSegundos: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }, {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }>, z.ZodObject<{
        nombre: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nombre?: string | undefined;
    }, {
        nombre?: string | undefined;
    }>>, "many">;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    estudianteId: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    updatedAt: Date;
    ejercicios: ({
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    } & {
        nombre?: string | undefined;
    })[];
    estudiante?: {
        id: string;
        nombre: string;
        email: string;
    } | undefined;
}, {
    id: string;
    estudianteId: string;
    nombre: string;
    createdAt: Date;
    descripcion: string | null;
    updatedAt: Date;
    ejercicios: ({
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    } & {
        nombre?: string | undefined;
    })[];
    estudiante?: {
        id: string;
        nombre: string;
        email: string;
    } | undefined;
}>;
export type Rutina = z.infer<typeof rutinaSchema>;
export declare const crearRutinaSchema: z.ZodObject<{
    nombre: z.ZodString;
    descripcion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    estudianteId: z.ZodString;
    ejercicios: z.ZodArray<z.ZodObject<{
        ejercicioId: z.ZodString;
        series: z.ZodNumber;
        repeticiones: z.ZodNumber;
        descansoSegundos: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }, {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    estudianteId: string;
    nombre: string;
    ejercicios: {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }[];
    descripcion?: string | null | undefined;
}, {
    estudianteId: string;
    nombre: string;
    ejercicios: {
        ejercicioId: string;
        series: number;
        repeticiones: number;
        descansoSegundos?: number | undefined;
    }[];
    descripcion?: string | null | undefined;
}>;
export type CrearRutina = z.infer<typeof crearRutinaSchema>;
