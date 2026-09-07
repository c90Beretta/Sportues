import { useState } from "react";

interface Props {
  rutinaId: string;
  ejercicioId: string;
  ejercicioNombre: string;
}

type Estado = "inactivo" | "ok";

export default function RegistrarEjercicio({ ejercicioId, ejercicioNombre }: Props) {
  const [estado, setEstado] = useState<Estado>("inactivo");

  return (
    <div>
      <button
        type="button"
        onClick={() => setEstado("ok")}
        disabled={estado === "ok"}
        className="secondary-button"
      >
        {estado === "ok" ? "✓ Completado" : "Marcar completado"}
      </button>
      {estado === "ok" && (
        <span className="form-success completion-message">¡Buen trabajo con {ejercicioNombre}!</span>
      )}
    </div>
  );
}
