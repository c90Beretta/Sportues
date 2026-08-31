"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function cerrarSesion() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      style={{
        background: "transparent",
        border: "1px solid #4b5563",
        color: "#e5e7eb",
        borderRadius: 6,
        padding: "0.35rem 0.75rem",
        cursor: "pointer",
        fontSize: "0.85rem",
      }}
    >
      Cerrar sesión
    </button>
  );
}