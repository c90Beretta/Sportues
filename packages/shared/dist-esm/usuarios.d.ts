import { z } from "zod";
export declare const rolUsuarioSchema: z.ZodEnum<["ESTUDIANTE", "STAFF"]>;
export type RolUsuario = z.infer<typeof rolUsuarioSchema>;
export declare const usuarioSchema: z.ZodObject<{
    id: z.ZodString;
    nombre: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodString;
    rol: z.ZodEnum<["ESTUDIANTE", "STAFF"]>;
    membresiaId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    nombre: string;
    email: string;
    createdAt: Date;
    passwordHash: string;
    rol: "ESTUDIANTE" | "STAFF";
    membresiaId: string | null;
    updatedAt: Date;
}, {
    id: string;
    nombre: string;
    email: string;
    createdAt: Date;
    passwordHash: string;
    rol: "ESTUDIANTE" | "STAFF";
    membresiaId: string | null;
    updatedAt: Date;
}>;
export type Usuario = z.infer<typeof usuarioSchema>;
export declare const crearUsuarioSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    nombre: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodString;
    rol: z.ZodEnum<["ESTUDIANTE", "STAFF"]>;
    membresiaId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "id" | "createdAt" | "passwordHash" | "updatedAt"> & {
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nombre: string;
    email: string;
    rol: "ESTUDIANTE" | "STAFF";
    membresiaId: string | null;
    password: string;
}, {
    nombre: string;
    email: string;
    rol: "ESTUDIANTE" | "STAFF";
    membresiaId: string | null;
    password: string;
}>;
export type CrearUsuario = z.infer<typeof crearUsuarioSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type Login = z.infer<typeof loginSchema>;
export declare const autenticacionResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    usuario: z.ZodObject<Omit<{
        id: z.ZodString;
        nombre: z.ZodString;
        email: z.ZodString;
        passwordHash: z.ZodString;
        rol: z.ZodEnum<["ESTUDIANTE", "STAFF"]>;
        membresiaId: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "passwordHash">, "strip", z.ZodTypeAny, {
        id: string;
        nombre: string;
        email: string;
        createdAt: Date;
        rol: "ESTUDIANTE" | "STAFF";
        membresiaId: string | null;
        updatedAt: Date;
    }, {
        id: string;
        nombre: string;
        email: string;
        createdAt: Date;
        rol: "ESTUDIANTE" | "STAFF";
        membresiaId: string | null;
        updatedAt: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        createdAt: Date;
        rol: "ESTUDIANTE" | "STAFF";
        membresiaId: string | null;
        updatedAt: Date;
    };
}, {
    accessToken: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        createdAt: Date;
        rol: "ESTUDIANTE" | "STAFF";
        membresiaId: string | null;
        updatedAt: Date;
    };
}>;
export type AutenticacionResponse = z.infer<typeof autenticacionResponseSchema>;
