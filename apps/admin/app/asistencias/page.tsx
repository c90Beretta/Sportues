import { requireSession, apiGet } from "@/lib/api";
import type { Asistencia } from "@gimnasio/shared";

export const dynamic = "force-dynamic";

export default async function AsistenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ estudianteId?: string }>;
}) {
  const sesion = await requireSession();
  const { estudianteId } = await searchParams;

  let asistencias: Asistencia[] = [];
  let error: string | null = null;

  try {
    const q = estudianteId ? `?estudianteId=${estudianteId}` : "";
    asistencias = await apiGet<Asistencia[]>(`/asistencias${q}`, sesion);
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudieron cargar las asistencias";
  }

  return (
    <div className="content-grid">
      <header className="page-header">
        <div>
          <p className="eyebrow">Control de acceso</p>
          <h1>Asistencias</h1>
          <p>Revisa los accesos registrados por los estudiantes del gimnasio.</p>
        </div>
        <span className="page-count">{asistencias.length} registros</span>
      </header>

      {error ? (
        <p className="error-message">{error}</p>
      ) : asistencias.length === 0 ? (
        <p className="empty-message">Todavía no hay asistencias registradas.</p>
      ) : (
        <div className="table-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Fecha de visita</th>
                <th>Hora de registro</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.estudiante?.nombre ?? "Sin identificar"}</strong></td>
                  <td>{new Date(a.fecha).toLocaleString("es")}</td>
                  <td>{new Date(a.createdAt).toLocaleString("es")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
