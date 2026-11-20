import { afterEach, describe, expect, it, vi } from "vitest";
import { getJwtSecret as secretoAdmin } from "../../apps/admin/lib/config";
import { getJwtSecret as secretoWeb } from "../../apps/web/src/lib/config";

afterEach(() => vi.unstubAllEnvs());

describe.each([
  ["admin", secretoAdmin],
  ["web", secretoWeb],
])("getJwtSecret (%s)", (_app, getJwtSecret) => {
  it("lanza un error explícito si JWT_SECRET no está definido", () => {
    vi.stubEnv("JWT_SECRET", undefined as unknown as string);
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it("lanza un error si JWT_SECRET está vacío o solo tiene espacios", () => {
    vi.stubEnv("JWT_SECRET", "   ");
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it("devuelve el valor configurado", () => {
    vi.stubEnv("JWT_SECRET", "un-secreto-de-prueba-largo");
    expect(getJwtSecret()).toBe("un-secreto-de-prueba-largo");
  });
});
