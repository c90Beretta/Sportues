"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@gimnasio/shared";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setCargando(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo iniciar sesión");
      setCargando(false);
      return;
    }

    router.push("/estudiantes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <label className="campo">
        Correo institucional
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="personal@ues.mx"
          required
        />
      </label>
      <label className="campo">
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="submit" className="btn" disabled={cargando}>
        {cargando ? "Ingresando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
