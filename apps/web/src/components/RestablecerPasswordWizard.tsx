import { useState } from "react";
import VerificacionCorreoForm from "./VerificacionCorreoForm";

export default function RestablecerPasswordWizard() {
  const [verificado, setVerificado] = useState<{ email: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);

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
    const res = await fetch("/api/registro/restablecer-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: verificado!.email, nuevaPassword: password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "No se pudo actualizar la contraseña");
      setLoading(false);
      return;
    }

    setListo(true);
  }

  if (listo) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-state-success/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-state-success">check_circle</span>
        </div>
        <p className="text-body-md text-text-primary">Tu contraseña se actualizó correctamente.</p>
        <a
          href="/login"
          className="w-full h-12 rounded-full text-label-lg text-white flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
        >
          Iniciar sesión
        </a>
      </div>
    );
  }

  if (!verificado) {
    return (
      <VerificacionCorreoForm
        proposito="RECUPERACION"
        onVerificado={(info) => setVerificado({ email: info.email })}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-body-md text-text-muted">
        Correo verificado: <strong className="text-on-surface">{verificado.email}</strong>. Escribe tu nueva contraseña.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-on-surface">Nueva contraseña</span>
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
        className="w-full h-12 rounded-full text-label-lg text-white tracking-wide shadow-md active:scale-[0.98] transition-all disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
      >
        {loading ? "Guardando…" : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}