import { requireSession, apiGet } from "@/lib/api";
import type { Ejercicio, Rutina, Usuario } from "@gimnasio/shared";
import { CrearRutinaForm } from "@/components/crear-rutina-form";

export const dynamic = "force-dynamic";

export default async function RutinasPage() {
  const sesion = await requireSession();

  let rutinas: Rutina[] = [];
  let estudiantes: Usuario[] = [];
  let ejercicios: Ejercicio[] = [];
  let error: string | null = null;

  try {
    [rutinas, estudiantes, ejercicios] = await Promise.all([
      apiGet<Rutina[]>("/rutinas", sesion),
      apiGet<Usuario[]>("/usuarios", sesion),
      apiGet<Ejercicio[]>("/ejercicios", sesion),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudieron cargar los datos";
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Gestión de rutinas</h1>

      {error ? (
        <p style={{ color: "#b91c1c" }}>{error}</p>
      ) : (
        <>
          <h2>Crear rutina</h2>
          <CrearRutinaForm estudiantes={estudiantes} ejercicios={ejercicios} />

          <h2>Rutinas asignadas</h2>
          {rutinas.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Todavía no hay rutinas asignadas.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
              {rutinas.map((r) => (
                <li key={r.id} className="card">
                  <strong>{r.nombre}</strong>
                  {r.descripcion && <span style={{ color: "#6b7280" }}> — {r.descripcion}</span>}
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    Estudiante: {r.estudiante?.nombre ?? r.estudianteId}
                  </div>
                  <ul style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                    {r.ejercicios.map((e) => (
                      <li key={e.ejercicioId}>
                        {e.nombre ?? e.ejercicioId} — {e.series}×{e.repeticiones} reps
                        {e.descansoSegundos ? ` (${e.descansoSegundos}s de descanso)` : ""}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}