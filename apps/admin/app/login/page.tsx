import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const sesion = await getSession();

  if (sesion) {
    redirect("/estudiantes");
  }

  return (
    <div className="admin-login">
      <section className="admin-login-visual">
        <div className="admin-login-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13.1 2.3c.3 3-1.9 4.2-3 6.1-.8 1.4-.7 3.1.5 4.2-.1-2.2 1.1-3.4 2.4-4.7.5 2.6 3.4 3.9 3.4 7.1 0 2.7-2 5-4.7 5-2.9 0-5.2-2.2-5.2-5.2 0-3.6 2.5-5.7 6.6-12.5Z" fill="currentColor" />
              <path d="M12 12.2c.2 1.5-1 2-1.4 3-.5 1.2.1 2.5 1.4 2.5 1.2 0 2-.9 2-2.1 0-1.5-1.2-2.3-2-3.4Z" fill="#ffae32" />
            </svg>
          </span>
          <div>
            <strong>UES FIT</strong>
            <span>Administración del gimnasio</span>
          </div>
        </div>
        <div className="admin-login-message">
          <h2>Todo el gimnasio, en un solo panel.</h2>
          <p>Gestiona estudiantes, asistencias y planes de entrenamiento con una vista clara.</p>
        </div>
      </section>
      <div className="admin-login-panel">
        <p className="eyebrow">Acceso de personal</p>
        <h1>Bienvenido de vuelta</h1>
        <p>Ingresa con tu cuenta STAFF para administrar UES Fit.</p>
        <LoginForm />
      </div>
    </div>
  );
}
