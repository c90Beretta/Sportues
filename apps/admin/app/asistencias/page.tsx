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
    <div>
      <h1 style={{ marginTop: 0 }}>Listado de asistencias</h1>

      {error ? (
        <p style={{ color: "#b91c1c" }}>{error}</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Fecha</th>
              <th>Registrada</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id}>
                <td>{a.estudiante?.nombre ?? "—"}</td>
                <td>{new Date(a.fecha).toLocaleString("es")}</td>
                <td>{new Date(a.createdAt).toLocaleString("es")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}