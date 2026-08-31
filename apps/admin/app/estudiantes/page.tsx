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
    <div>
      <h1 style={{ marginTop: 0 }}>Listado de estudiantes</h1>

      {error ? (
        <p style={{ color: "#b91c1c" }}>{error}</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Membresía</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <span className={u.rol === "STAFF" ? "badge badge-staff" : "badge"}>
                    {u.rol}
                  </span>
                </td>
                <td>{u.membresia?.nombre ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}