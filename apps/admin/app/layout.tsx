import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Gimnasio · Panel de administración",
  description: "Panel administrativo del proyecto universitario de gestión de gimnasio",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSession();

  return (
    <html lang="es">
      <body>
        {sesion && (
          <header
            style={{
              background: "#111827",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <strong>🏋️ Gimnasio</strong>
              <Link href="/estudiantes" style={{ color: "#e5e7eb" }}>
                Estudiantes
              </Link>
              <Link href="/asistencias" style={{ color: "#e5e7eb" }}>
                Asistencias
              </Link>
              <Link href="/rutinas" style={{ color: "#e5e7eb" }}>
                Rutinas
              </Link>
            </nav>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#d1d5db" }}>{sesion.usuario.email}</span>
              <LogoutButton />
            </div>
          </header>
        )}
        <main style={{ maxWidth: 70, margin: "1.5rem auto", padding: "0 1rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}