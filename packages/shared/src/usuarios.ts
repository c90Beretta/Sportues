import { z } from "zod";

export const rolUsuarioSchema = z.enum(["ESTUDIANTE", "STAFF"]);
export type RolUsuario = z.infer<typeof rolUsuarioSchema>;

export const usuarioSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  email: z.string().email(),
  passwordHash: z.string(),
  rol: rolUsuarioSchema,
  membresiaId: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Usuario = z.infer<typeof usuarioSchema>;

export const crearUsuarioSchema = usuarioSchema
  .omit({ id: true, passwordHash: true, createdAt: true, updatedAt: true })
  .extend({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });
export type CrearUsuario = z.infer<typeof crearUsuarioSchema>;

export const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
export type Login = z.infer<typeof loginSchema>;

export const autenticacionResponseSchema = z.object({
  accessToken: z.string(),
  usuario: usuarioSchema.omit({ passwordHash: true }),
});
export type AutenticacionResponse = z.infer<typeof autenticacionResponseSchema>;