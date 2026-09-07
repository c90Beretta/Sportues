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
    <div className="checkin-action">
      <button
        type="button"
        onClick={registrar}
        disabled={estado === "cargando" || estado === "ok"}
        className="primary-button"
      >
        {estado === "ok" ? "✓ Registrado" : estado === "cargando" ? "Registrando…" : "Check-in"}
      </button>
      {estado === "error" && (
        <span className="form-error" role="alert">No se pudo registrar. Inténtalo de nuevo.</span>
      )}
      {estado === "ok" && (
        <span className="form-success">¡Asistencia registrada hoy!</span>
      )}
    </div>
  );
}
