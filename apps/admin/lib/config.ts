export const API_URL = process.env.API_URL ?? "http://localhost:3000";
export function getJwtSecret(): string {
  const secreto = process.env.JWT_SECRET;
  if (!secreto || secreto.trim() === "") {
    throw new Error("JWT_SECRET no está definido. Configúralo en el entorno; no existe un valor por defecto.");
  }
  return secreto;
}