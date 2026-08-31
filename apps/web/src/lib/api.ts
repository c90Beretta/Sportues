import { API_URL } from "./config";
import type { SesionEstudiante } from "./auth";

export async function apiGet<T>(path: string, sesion?: SesionEstudiante | null): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`La API respondió con ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost(
  path: string,
  body: unknown,
  sesion?: SesionEstudiante | null,
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}