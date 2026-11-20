import { obtenerJwtSecret } from "./jwt-secret";

describe("obtenerJwtSecret", () => {
  const configCon = (valor: string | undefined) => ({ get: () => valor });

  it("lanza un error explícito si JWT_SECRET no está definido", () => {
    expect(() => obtenerJwtSecret(configCon(undefined))).toThrow(/JWT_SECRET/);
  });

  it("lanza un error si JWT_SECRET está vacío o solo tiene espacios", () => {
    expect(() => obtenerJwtSecret(configCon(""))).toThrow(/JWT_SECRET/);
    expect(() => obtenerJwtSecret(configCon("   "))).toThrow(/JWT_SECRET/);
  });

  it("devuelve el valor configurado", () => {
    expect(obtenerJwtSecret(configCon("un-secreto-de-prueba-largo"))).toBe("un-secreto-de-prueba-largo");
  });
});
