import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const sesion = await getSession();

  if (sesion) {
    redirect("/estudiantes");
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Iniciar sesión</h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Acceso exclusivo para personal (STAFF).
        </p>
        <LoginForm />
      </div>
    </div>
  );
}