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
    <div className="content-grid">
      <header className="page-header">
        <div>
          <p className="eyebrow">Planes de entrenamiento</p>
          <h1>Rutinas</h1>
          <p>Crea planes personalizados y consulta las rutinas asignadas.</p>
        </div>
        <span className="page-count">{rutinas.length} asignadas</span>
      </header>

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="two-column-grid">
          <section>
            <div className="section-heading">
              <h2>Nueva rutina</h2>
              <p>Define el plan y los ejercicios para un estudiante.</p>
            </div>
            <CrearRutinaForm estudiantes={estudiantes} ejercicios={ejercicios} />
          </section>

          <section>
            <div className="section-heading">
              <h2>Rutinas asignadas</h2>
              <p>Planes de entrenamiento disponibles actualmente.</p>
            </div>
            {rutinas.length === 0 ? (
              <p className="empty-message">Todavía no hay rutinas asignadas.</p>
            ) : (
              <ul className="routine-list">
                {rutinas.map((r) => (
                  <li key={r.id} className="card routine-card">
                    <div className="routine-card-header">
                      <div>
                        <h3>{r.nombre}</h3>
                        {r.descripcion && <p>{r.descripcion}</p>}
                      </div>
                      <span className="badge">{r.ejercicios.length} ejercicios</span>
                    </div>
                    <div className="routine-student">
                      Estudiante: <strong>{r.estudiante?.nombre ?? r.estudianteId}</strong>
                    </div>
                    <ul className="routine-exercises">
                      {r.ejercicios.map((e) => (
                        <li key={e.ejercicioId}>
                          {e.nombre ?? e.ejercicioId} · {e.series}×{e.repeticiones} repeticiones
                          {e.descansoSegundos ? ` · ${e.descansoSegundos}s de descanso` : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
