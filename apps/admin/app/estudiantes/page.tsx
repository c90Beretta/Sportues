import { requireSession, apiGet } from "@/lib/api";
import type { Usuario } from "@gimnasio/shared";

interface UsuarioConMembresia extends Usuario {
  membresia?: { id: string; nombre: string } | null;
}

export const dynamic = "force-dynamic";

export default async function EstudiantesPage() {
  const sesion = await requireSession();

  let usuarios: UsuarioConMembresia[] = [];
  let error: string | null = null;

  try {
    usuarios = await apiGet<UsuarioConMembresia[]>("/usuarios", sesion);
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudieron cargar los usuarios";
  }

  return (
    <div className="content-grid">
      <header className="page-header">
        <div>
          <p className="eyebrow">Comunidad UES Fit</p>
          <h1>Estudiantes</h1>
          <p>Consulta los perfiles registrados, sus roles y membresías activas.</p>
        </div>
        <span className="page-count">{usuarios.length} registros</span>
      </header>

      {error ? (
        <p className="error-message">{error}</p>
      ) : usuarios.length === 0 ? (
        <p className="empty-message">Todavía no hay estudiantes registrados.</p>
      ) : (
        <div className="table-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo institucional</th>
                <th>Rol</th>
                <th>Membresía</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={u.rol === "STAFF" ? "badge badge-staff" : "badge"}>
                      {u.rol}
                    </span>
                  </td>
                  <td>{u.membresia?.nombre ?? "Sin membresía"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
