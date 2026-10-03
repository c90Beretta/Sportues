import { requireSession, apiGet } from "@/lib/api";
import type { Ejercicio, Rutina } from "@gimnasio/shared";
import { CrearRutinaForm } from "@/components/crear-rutina-form";

export const dynamic = "force-dynamic";

const ETIQUETA_NIVEL: Record<string, string> = {
  PRINCIPIANTE: "Principiante",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
};

export default async function RutinasPage() {
  const sesion = await requireSession();

  let rutinas: Rutina[] = [];
  let ejercicios: Ejercicio[] = [];
  let error: string | null = null;

  try {
    [rutinas, ejercicios] = await Promise.all([
      apiGet<Rutina[]>("/rutinas", sesion),
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
          <p>Crea y consulta el catálogo oficial de rutinas por nivel.</p>
        </div>
        <span className="page-count">{rutinas.length} en el catálogo</span>
      </header>

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="two-column-grid">
          <section>
            <div className="section-heading">
              <h2>Nueva rutina</h2>
              <p>Define el plan, su nivel y los ejercicios que incluye.</p>
            </div>
            <CrearRutinaForm ejercicios={ejercicios} />
          </section>

          <section>
            <div className="section-heading">
              <h2>Catálogo oficial</h2>
              <p>Rutinas disponibles actualmente para los alumnos.</p>
            </div>
            {rutinas.length === 0 ? (
              <p className="empty-message">Todavía no hay rutinas en el catálogo.</p>
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
                      Nivel: <strong>{r.nivel ? ETIQUETA_NIVEL[r.nivel] : "—"}</strong>
                      {r.creadaPor && <> · Creada por {r.creadaPor.nombre}</>}
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