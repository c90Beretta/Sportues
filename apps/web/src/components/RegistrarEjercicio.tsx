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
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setEstado("ok")}
        disabled={estado === "ok"}
        className="border border-slate-300 hover:bg-slate-100 disabled:border-emerald-400 disabled:text-emerald-700 rounded py-1.5 px-3 text-sm"
      >
        {estado === "ok" ? "✓ Completado" : "Marcar completado"}
      </button>
      {estado === "ok" && (
        <span className="text-emerald-700 text-xs">¡Buen trabajo con {ejercicioNombre}!</span>
      )}
    </div>
  );
}