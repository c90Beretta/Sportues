import { useState } from "react";
import VerificacionCorreoForm from "./VerificacionCorreoForm";

export default function CrearCuentaWizard() {
  const [verificado, setVerificado] = useState<{ email: string; nombre: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/registro/crear-cuenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: verificado!.email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear la cuenta");
      setLoading(false);
      return;
    }

    window.location.href = "/registro/perfil";
  }

  if (!verificado) {
    return (
      <VerificacionCorreoForm
        proposito="REGISTRO"
        onVerificado={(info) => setVerificado({ email: info.email, nombre: info.nombre })}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-body-md text-text-muted">
        Correo verificado: <strong className="text-on-surface">{verificado.email}</strong>. Ahora crea tu contraseña.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-on-surface">Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          placeholder="Mínimo 8 caracteres"
          className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-on-surface">Confirmar contraseña</span>
        <input
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          minLength={8}
          required
          className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all"
        />
      </label>

      {error && <p role="alert" className="text-body-sm text-state-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full text-label-lg text-white tracking-wide shadow-md active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
      >
        {loading ? "Creando cuenta…" : "Crear cuenta"}
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
      </button>
    </form>
  );
}