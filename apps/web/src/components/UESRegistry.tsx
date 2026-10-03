import { useState } from "react";
import CertificadoMedico from "./MedicalCertificate";

interface Props {
  nombre: string;
  carrera: string;
}

const NIVELES = [
  { valor: "PRINCIPIANTE", icono: "eco", titulo: "Principiante", rango: "0 - 6 meses", desc: "Primera vez en sala de pesas o poco conocimiento de máquinas y técnicas." },
  { valor: "INTERMEDIO", icono: "fitness_center", titulo: "Intermedio", rango: "6 m - 2 años", desc: "Conozco ejercicios básicos, técnica de barra y uso habitual de máquinas guiadas." },
  { valor: "AVANZADO", icono: "military_tech", titulo: "Avanzado", rango: "+2 años", desc: "Entrenamiento con sobrecarga progresiva, RPE/RIR y levantamientos libres pesados." },
] as const;

export default function UESRegistry({ nombre, carrera }: Props) {
  const [nivel, setNivel] = useState<(typeof NIVELES)[number]["valor"]>("INTERMEDIO");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!archivo) {
      setError("El certificado médico es obligatorio");
      return;
    }
    if (!acepto) {
      setError("Debes aceptar el reglamento interno");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("nivelExperiencia", nivel);
    formData.append("certificado", archivo);

    const res = await fetch("/api/registro/completar-perfil", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "No se pudo completar tu perfil");
      setLoading(false);
      return;
    }

    // Cerramos la sesión temporal del registro y mandamos a iniciar sesión de verdad.
    window.location.href = "/api/logout";
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Datos ya confirmados — de solo lectura, vienen de la base de datos */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
          <div>
            <h2 className="font-heading text-headline-sm text-text-primary leading-tight">Datos de Alumno UES</h2>
            <p className="text-body-sm text-text-muted">Confirmados con tu correo institucional</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-body-md text-text-primary">
          <span><strong>Nombre:</strong> {nombre}</span>
          <span><strong>Carrera:</strong> {carrera}</span>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-xl">fitness_center</span>
          </div>
          <div>
            <h2 className="font-heading text-headline-sm text-text-primary leading-tight">
              Experiencia en gimnasio <span className="text-state-error">*</span>
            </h2>
            <p className="text-body-sm text-text-muted">Selecciona tu nivel actual para sugerirte equipo adecuado</p>
          </div>
        </div>

        <div role="radiogroup" aria-label="Nivel de experiencia deportiva" className="flex flex-col gap-2">
          {NIVELES.map((n) => {
            const seleccionado = nivel === n.valor;
            return (
              <div
                key={n.valor}
                role="radio"
                aria-checked={seleccionado}
                tabIndex={0}
                onClick={() => setNivel(n.valor)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setNivel(n.valor)}
                className={`relative flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                  seleccionado ? "bg-surface-container shadow-sm" : "bg-background hover:bg-surface-container-low"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                  seleccionado ? "bg-primary-container text-white" : "bg-surface-container-lowest text-secondary"
                }`}>
                  <span className="material-symbols-outlined text-[22px]">{n.icono}</span>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-label-lg font-heading ${seleccionado ? "text-primary-container" : "text-text-primary"}`}>{n.titulo}</span>
                    <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-text-muted">{n.rango}</span>
                  </div>
                  <p className={`text-body-sm mt-1 leading-snug ${seleccionado ? "text-text-primary" : "text-text-muted"}`}>{n.desc}</p>
                </div>
                <div className={`absolute right-4 top-4 w-5 h-5 rounded-full flex items-center justify-center ${
                  seleccionado ? "bg-primary-container text-white" : "bg-surface-container-highest"
                }`}>
                  {seleccionado && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CertificadoMedico archivo={archivo} onArchivoChange={setArchivo} />

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded"
          />
          <span className="text-body-md text-text-primary leading-snug">
            Acepto el <span className="text-label-md font-heading text-primary-container underline">reglamento interno</span> del Gimnasio Central UES y el deslinde de responsabilidad deportiva institucional.
          </span>
        </label>
      </div>

      {error && <p role="alert" className="text-body-sm text-state-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-full text-text-primary text-label-lg font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(90deg, #fda540, #edc155)" }}
      >
        {loading ? "Guardando…" : "Continuar y Activar Pase"}
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </form>
  );
}