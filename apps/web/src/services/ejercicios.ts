import { ejercicioSchema, type Ejercicio } from "@gimnasio/shared";

export async function listEjercicios(): Promise<Ejercicio[]> {
  const res = await fetch("/api/ejercicios");
  if (!res.ok) throw new Error(`La API respondió con ${res.status}`);
  return ejercicioSchema.array().parse(await res.json());
}