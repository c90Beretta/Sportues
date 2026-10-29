import { useEffect } from "react";
import { useEjerciciosStore } from "../stores/ejerciciosStore";

export default function CrearRutina() {
  const items = useEjerciciosStore((s) => s.items);
  const status = useEjerciciosStore((s) => s.status);
  const error = useEjerciciosStore((s) => s.error);
  const fetchAll = useEjerciciosStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (status === "idle" || status === "loading") {
    return <div className="ues-card empty-state"><strong>Cargando ejercicios…</strong></div>;
  }
  if (status === "error") {
    return <p className="ues-card error-state">{error}</p>;
  }
  if (items.length === 0) {
    return (
      <div className="ues-card empty-state">
        <strong>Sin ejercicios</strong>
        <p>El catálogo todavía está vacío.</p>
      </div>
    );
  }

  return (
    <div className="ues-card">
      <ul>
        {items.map((e) => (
          <li key={e.id}>
            <strong>{e.nombre}</strong>{" "}
            <span>{e.gruposMusculares.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}