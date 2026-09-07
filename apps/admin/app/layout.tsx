import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "UES Fit · Panel de administración",
  description: "Panel administrativo del gimnasio de la Universidad Estatal de Sonora",
};

const enlaces = [
  {
    href: "/estudiantes",
    etiqueta: "Estudiantes",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/asistencias",
    etiqueta: "Asistencias",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m8 15 2 2 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/rutinas",
    etiqueta: "Rutinas",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8v8M7 6v12M17 6v12M20 8v8M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M13.1 2.3c.3 3-1.9 4.2-3 6.1-.8 1.4-.7 3.1.5 4.2-.1-2.2 1.1-3.4 2.4-4.7.5 2.6 3.4 3.9 3.4 7.1 0 2.7-2 5-4.7 5-2.9 0-5.2-2.2-5.2-5.2 0-3.6 2.5-5.7 6.6-12.5Z" fill="currentColor" />
        <path d="M12 12.2c.2 1.5-1 2-1.4 3-.5 1.2.1 2.5 1.4 2.5 1.2 0 2-.9 2-2.1 0-1.5-1.2-2.3-2-3.4Z" fill="#ffae32" />
      </svg>
    </span>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSession();
  const alias = sesion?.usuario.email.split("@")[0] ?? "";
  const inicial = alias.charAt(0).toUpperCase() || "A";

  return (
    <html lang="es">
      <body>
        {sesion ? (
          <div className="admin-shell">
            <header className="admin-topbar">
              <div className="admin-topbar-content">
                <Link href="/estudiantes" className="brand" aria-label="UES Fit Administración">
                  <BrandMark />
                  <span className="brand-copy">
                    <strong>UES FIT</strong>
                    <small>Panel administrativo</small>
                  </span>
                </Link>

                <div className="admin-profile">
                  <button className="icon-button" type="button" aria-label="Notificaciones">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span />
                  </button>
                  <div className="profile-copy">
                    <strong>Personal UES</strong>
                    <span>{sesion.usuario.email}</span>
                  </div>
                  <div className="avatar">{inicial}</div>
                  <LogoutButton />
                </div>
              </div>
            </header>

            <div className="admin-frame">
              <aside className="admin-sidebar">
                <p className="sidebar-label">Gestión del gimnasio</p>
                <nav className="sidebar-nav" aria-label="Navegación administrativa">
                  {enlaces.map((enlace) => (
                    <Link href={enlace.href} key={enlace.href}>
                      {enlace.icono}
                      <span>{enlace.etiqueta}</span>
                    </Link>
                  ))}
                </nav>
                <div className="campus-card">
                  <span className="campus-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="10" r="2" fill="currentColor" />
                    </svg>
                  </span>
                  <div>
                    <strong>Campus Hermosillo</strong>
                    <span>Gimnasio central</span>
                  </div>
                </div>
              </aside>

              <main className="admin-main">{children}</main>
            </div>

            <nav className="admin-mobile-nav" aria-label="Navegación administrativa móvil">
              {enlaces.map((enlace) => (
                <Link href={enlace.href} key={enlace.href}>
                  {enlace.icono}
                  <span>{enlace.etiqueta}</span>
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          <main className="admin-auth-main">{children}</main>
        )}
      </body>
    </html>
  );
}
