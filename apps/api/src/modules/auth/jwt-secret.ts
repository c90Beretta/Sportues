export function obtenerJwtSecret(config: { get: (clave: string) => string | undefined }): string {
  const secreto = config.get("JWT_SECRET");
  if (!secreto || secreto.trim() === "") {
    throw new Error("JWT_SECRET no está definido. Configúralo en el entorno; no existe un valor por defecto.");
  }
  return secreto;
}
