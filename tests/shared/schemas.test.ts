import { describe, expect, it } from "vitest";
import { loginSchema, crearUsuarioSchema } from "../../packages/shared/src/usuarios";
import { ejercicioEnRutinaSchema } from "../../packages/shared/src/rutinas";

describe("loginSchema (validación de formularios de admin y web)", () => {
  it("acepta un email válido y una contraseña no vacía", () => {
    expect(loginSchema.safeParse({ email: "ana@ues.mx", password: "x" }).success).toBe(true);
  });

  it("rechaza un email inválido con el mensaje en español", () => {
    const r = loginSchema.safeParse({ email: "no-es-correo", password: "x" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe("El email no es válido");
  });

  it("rechaza una contraseña vacía con el mensaje en español", () => {
    const r = loginSchema.safeParse({ email: "ana@ues.mx", password: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe("La contraseña es obligatoria");
  });
});

describe("crearUsuarioSchema", () => {
  const base = { nombre: "Ana", email: "ana@ues.mx", rol: "ESTUDIANTE" as const };

  it("acepta una contraseña de 6 caracteres", () => {
    expect(crearUsuarioSchema.safeParse({ ...base, password: "123456" }).success).toBe(true);
  });

  it("rechaza una contraseña de 5 caracteres", () => {
    const r = crearUsuarioSchema.safeParse({ ...base, password: "12345" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toContain("al menos 6");
  });

  it("rechaza un rol que no existe", () => {
    expect(crearUsuarioSchema.safeParse({ ...base, rol: "ADMIN", password: "123456" }).success).toBe(false);
  });
});

describe("ejercicioEnRutinaSchema", () => {
  const uuid = "123e4567-e89b-42d3-a456-426614174000";

  it("acepta series y repeticiones positivas", () => {
    expect(ejercicioEnRutinaSchema.safeParse({ ejercicioId: uuid, orden: 0, series: 3, repeticiones: 10 }).success).toBe(true);
  });

  it("rechaza 0 series", () => {
    expect(ejercicioEnRutinaSchema.safeParse({ ejercicioId: uuid, orden: 0, series: 0, repeticiones: 10 }).success).toBe(false);
  });

  it("rechaza un ejercicioId que no es uuid", () => {
    expect(ejercicioEnRutinaSchema.safeParse({ ejercicioId: "abc", orden: 0, series: 3, repeticiones: 10 }).success).toBe(false);
  });
});
