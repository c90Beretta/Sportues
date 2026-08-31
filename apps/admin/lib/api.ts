import { redirect } from "next/navigation";
import { API_URL } from "./config";
import { getSession } from "./auth";

export class ApiError extends Error {}

export function requireSession() {
  return getSession().then((sesion) => {
    if (!sesion) {
      redirect("/login");
    }
    return sesion;
  });
}

export async function apiGet<T>(path: string, sesion?: Awaited<ReturnType<typeof getSession>>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: sesion ? { Authorization: `Bearer ${sesion.token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(`La API respondió con ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost(path: string, body: unknown, sesion?: Awaited<ReturnType<typeof getSession>>) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sesion ? { Authorization: `Bearer ${sesion.token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  return res;
}