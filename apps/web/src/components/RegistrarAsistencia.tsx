import { useState } from "react";

type Estado = "inactivo" | "cargando" | "ok" | "error";

export default function RegistrarAsistencia() {
  const [estado, setEstado] = useState<Estado>("inactivo");

  async function registrar() {
    setEstado("cargando");
    const res = await fetch("/api/asistencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      setEstado("ok");
    } else {
      setEstado("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={registrar}
        disabled={estado === "cargando" || estado === "ok"}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded py-2 px-4 text-sm"
      >
        {estado === "ok" ? "✓ Registrado" : estado === "cargando" ? "Registrando…" : "Check-in"}
      </button>
      {estado === "error" && (
        <span className="text-red-600 text-xs">No se pudo registrar. Intentalo de nuevo.</span>
      )}
      {estado === "ok" && (
        <span className="text-emerald-700 text-xs">¡Asistencia registrada hoy!</span>
      )}
    </div>
  );
}