import { useState } from "react";

interface Props {
  proposito: "REGISTRO" | "RECUPERACION";
  onVerificado: (info: { email: string; nombre: string; carrera: string }) => void;
}

export default function VerificacionCorreoForm({ proposito, onVerificado }: Props) {
  const [fase, setFase] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enviarCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/registro/solicitar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, proposito }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "No se pudo enviar el código");
      setLoading(false);
      return;
    }

    setNombre(data.nombre ?? "");
    setFase("codigo");
    setLoading(false);
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/registro/verificar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codigo }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Código incorrecto");
      setLoading(false);
      return;
    }

    onVerificado({ email, nombre: data.nombre, carrera: data.carrera });
  }

  if (fase === "email") {
    return (
      <form onSubmit={enviarCodigo} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-heading text-on-surface">Correo institucional</span>
          <span className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-xl text-outline pointer-events-none">
              alternate_email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej. 23020220069@ues.mx"
              required
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all placeholder:text-outline/70"
            />
          </span>
        </label>

        {error && <p role="alert" className="text-body-sm text-state-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full text-label-lg text-white tracking-wide shadow-md active:scale-[0.98] transition-all disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
        >
          {loading ? "Enviando…" : "Enviar código"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verificarCodigo} className="flex flex-col gap-4">
      <p className="text-body-md text-text-muted">
        {nombre ? `Hola ${nombre}, e` : "E"}nviamos un código de 6 dígitos a{" "}
        <strong className="text-on-surface">{email}</strong>. Revisa también spam.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-on-surface">Código de verificación</span>
        <input
          type="text"
          inputMode="numeric"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          required
          className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md tracking-[0.3em] text-center outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container transition-all"
        />
      </label>

      {error && <p role="alert" className="text-body-sm text-state-error">{error}</p>}

      <button
        type="submit"
        disabled={loading || codigo.length !== 6}
        className="w-full h-12 rounded-full text-label-lg text-white tracking-wide shadow-md active:scale-[0.98] transition-all disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #6B252A 0%, #B84728 50%, #E8942F 100%)" }}
      >
        {loading ? "Verificando…" : "Verificar código"}
      </button>

      <button
        type="button"
        onClick={() => enviarCodigo()}
        disabled={loading}
        className="text-label-md font-heading text-secondary hover:underline self-center"
      >
        Reenviar código
      </button>
    </form>
  );
}