import { useCallback, useState } from "react";
import {
  loginSchema,
  type AutenticacionResponse,
  type Usuario,
} from "@gimnasio/shared";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "No se pudo iniciar sesión");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-on-surface flex items-center gap-1">
          Correo institucional <span className="text-secondary font-bold">*</span>
        </span>
        <span className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-xl text-outline pointer-events-none">
            alternate_email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="ejemplo: 23020220070@ues.mx"
            required
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all placeholder:text-outline/70"
          />
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center justify-between">
          <span className="text-label-md font-heading text-on-surface flex items-center gap-1">
            Contraseña <span className="text-secondary font-bold">*</span>
          </span>
          <span className="text-label-sm text-text-muted">Mínimo 8 carácteres</span>
        </span>
        <span className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-xl text-outline pointer-events-none">
            lock
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="**********"
            required
            minLength={8}
            className="w-full h-12 pl-11 pr-12 rounded-xl bg-surface-container-lowest text-on-surface text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all placeholder:text-outline/70"
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 w-9 h-9 flex items-center justify-center rounded-lg text-outline hover:text-on-surface active:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </span>
      </label>

      {error && (
        <p role="alert" className="text-body-sm text-state-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-2 rounded-full text-label-lg text-white tracking-wide shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verificando…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Iniciar sesión
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </span>
        )}
      </button>
    </form>
  );
}