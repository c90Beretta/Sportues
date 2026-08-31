"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearRutinaSchema } from "@gimnasio/shared";
import type { Ejercicio, Usuario } from "@gimnasio/shared";

export function CrearRutinaForm({
  estudiantes,
  ejercicios,
}: {
  estudiantes: Usuario[];
  ejercicios: Ejercicio[];
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [renglones, setRenglones] = useState<
    { ejercicioId: string; series: number; repeticiones: number; descansoSegundos: number }[]
  >([{ ejercicioId: "", series: 3, repeticiones: 10, descansoSegundos: 60 }]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function actualizarRenglon(
    index: number,
    campo: "ejercicioId" | "series" | "repeticiones" | "descansoSegundos",
    valor: string | number,
  ) {
    setRenglones((prev) => prev.map((r, i) => (i === index ? { ...r, [campo]: valor } : r)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = crearRutinaSchema.safeParse({
      nombre,
      descripcion: descripcion || null,
      estudianteId,
      ejercicios: renglones.map((r) => ({
        ...r,
        descansoSegundos: r.descansoSegundos || undefined,
      })),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setCargando(true);
    const res = await fetch("/api/rutinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear la rutina");
      setCargando(false);
      return;
    }

    setNombre("");
    setDescripcion("");
    setRenglones([{ ejercicioId: "", series: 3, repeticiones: 10, descansoSegundos: 60 }]);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <label className="campo">
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </label>
      <label className="campo">
        Descripción
        <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </label>
      <label className="campo">
        Estudiante
        <select value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)} required>
          <option value="">Seleccionar estudiante…</option>
          {estudiantes
            .filter((u) => u.rol === "ESTUDIANTE")
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} ({u.email})
              </option>
            ))}
        </select>
      </label>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        {renglones.map((renglon, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label className="campo" style={{ flex: 2 }}>
              Ejercicio
              <select
                value={renglon.ejercicioId}
                onChange={(e) => actualizarRenglon(i, "ejercicioId", e.target.value)}
                required
              >
                <option value="">Elegir…</option>
                {ejercicios.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="campo">
              Series
              <input
                type="number"
                min={1}
                value={renglon.series}
                onChange={(e) => actualizarRenglon(i, "series", Number(e.target.value))}
              />
            </label>
            <label className="campo">
              Reps
              <input
                type="number"
                min={1}
                value={renglon.repeticiones}
                onChange={(e) => actualizarRenglon(i, "repeticiones", Number(e.target.value))}
              />
            </label>
            <label className="campo">
              Descanso (s)
              <input
                type="number"
                min={0}
                value={renglon.descansoSegundos}
                onChange={(e) => actualizarRenglon(i, "descansoSegundos", Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              onClick={() => setRenglones((prev) => prev.filter((_, idx) => idx !== i))}
              style={{ marginTop: "1.1rem", background: "none", border: "none", cursor: "pointer", color: "#b91c1c" }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRenglones((prev) => [
              ...prev,
              { ejercicioId: "", series: 3, repeticiones: 10, descansoSegundos: 60 },
            ])
          }
          style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 6, padding: "0.4rem", cursor: "pointer" }}
        >
          + Agregar ejercicio
        </button>
      </div>

      {error && <p style={{ color: "#b91c1c", margin: 0, fontSize: "0.85rem" }}>{error}</p>}

      <button type="submit" className="btn" disabled={cargando}>
        {cargando ? "Creando…" : "Crear rutina"}
      </button>
    </form>
  );
}