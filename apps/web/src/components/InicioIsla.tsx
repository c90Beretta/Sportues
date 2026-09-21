import { useState, useEffect } from "react";

interface Props {
  nombre: string;
}

export default function InicioIsla({ nombre }: Props) {
  const [segundos, setSegundos] = useState(14 * 60 + 28);
  const [girando, setGirando] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 15 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  const vigencia = `${String(minutos).padStart(2, "0")}:${String(segs).padStart(2, "0")} min`;

  function actualizarQr() {
    setGirando(true);
    setTimeout(() => {
      setSegundos(15 * 60);
      setGirando(false);
    }, 500);
  }

  return (
    <div className="flex flex-col w-full gap-4 px-4 pt-4 pb-28">

      {/* Saludo */}
      <section className="flex items-center justify-between gap-2 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-headline-sm">
              {nombre.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-state-success rounded-full border-2 border-surface-container-lowest" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                Buen día, {nombre}
              </span>
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                waving_hand
              </span>
            </div>
            <div className="flex items-center gap-1 text-text-muted">
              <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
              <span className="font-label-md text-label-md truncate">Gimnasio Central · Campus Hermosillo</span>
            </div>
          </div>
        </div>
        <div className="relative shrink-0">
          <button
            aria-label="Notificaciones"
            className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-surface-container transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center justify-center shadow-sm">
            3
          </span>
        </div>
      </section>

      {/* Tarjeta Hero: Aforo en Tiempo Real */}
      <section className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-4 shadow-md">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-state-success" />
              </span>
              <span className="font-label-md text-label-md tracking-wider uppercase text-white/80 font-bold">
                En servicio
              </span>
            </div>
            <div className="bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">sensors</span>
              <span className="font-label-sm text-label-sm text-white/90">Actualizado ahora</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm text-white/70">Aforo en tiempo real</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-metric-xl text-metric-xl text-white font-black leading-none">47</span>
                <span className="font-headline-sm text-headline-sm text-white/60 font-medium">/ 75</span>
              </div>
              <p className="font-label-md text-label-md text-white/90 mt-1 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-state-success">check_circle</span>
                Capacidad moderada · Flujo óptimo
              </p>
            </div>

            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 72 72">
                <defs>
                  <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8942F" />
                    <stop offset="100%" stopColor="#F5C85B" />
                  </linearGradient>
                </defs>
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6.5" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="url(#flameGrad)" strokeDasharray="188.49" strokeDashoffset="71.6" strokeLinecap="round" strokeWidth="6.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-label-lg text-label-lg font-bold text-white leading-none">62%</span>
                <span className="font-label-sm text-label-sm text-white/70">cupo</span>
              </div>
            </div>
          </div>

          <div className="mt-1 pt-1 bg-white/10 px-3 py-2 rounded-lg flex items-center justify-between text-white/90">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">schedule</span>
              <span className="font-body-sm text-body-sm">Pico estimado: 17:30 a 19:30 hrs</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim font-bold uppercase">Planifica</span>
          </div>
        </div>
      </section>

      {/* Pase de Acceso QR */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">qr_code_scanner</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Tu Pase de Acceso QR</h2>
          </div>
          <div className="bg-surface-container-high px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-state-success" />
            <span className="font-label-sm text-label-sm font-bold text-primary">Acceso Activo</span>
          </div>
        </div>

        <div className="relative p-3 bg-white rounded-xl shadow-[0_4px_16px_-2px_rgba(63,48,48,0.08)] flex items-center justify-center my-1">
          <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Esquinas */}
            <rect x="12" y="12" width="46" height="46" rx="8" fill="#4E0F16" />
            <rect x="20" y="20" width="30" height="30" rx="4" fill="#FFFFFF" />
            <rect x="26" y="26" width="18" height="18" rx="2" fill="#4E0F16" />
            <rect x="142" y="12" width="46" height="46" rx="8" fill="#4E0F16" />
            <rect x="150" y="20" width="30" height="30" rx="4" fill="#FFFFFF" />
            <rect x="156" y="26" width="18" height="18" rx="2" fill="#4E0F16" />
            <rect x="12" y="142" width="46" height="46" rx="8" fill="#4E0F16" />
            <rect x="20" y="150" width="30" height="30" rx="4" fill="#FFFFFF" />
            <rect x="26" y="156" width="18" height="18" rx="2" fill="#4E0F16" />
            {/* Datos QR */}
            <circle cx="72" cy="20" r="4" fill="#6B252A" /><circle cx="86" cy="20" r="4" fill="#6B252A" />
            <circle cx="100" cy="20" r="4" fill="#4E0F16" /><circle cx="114" cy="20" r="4" fill="#6B252A" />
            <circle cx="128" cy="20" r="4" fill="#4E0F16" /><circle cx="72" cy="34" r="4" fill="#4E0F16" />
            <circle cx="100" cy="34" r="4" fill="#6B252A" /><circle cx="128" cy="34" r="4" fill="#6B252A" />
            <circle cx="72" cy="48" r="4" fill="#6B252A" /><circle cx="86" cy="48" r="4" fill="#4E0F16" />
            <circle cx="114" cy="48" r="4" fill="#6B252A" /><circle cx="20" cy="72" r="4" fill="#6B252A" />
            <circle cx="34" cy="72" r="4" fill="#4E0F16" /><circle cx="48" cy="72" r="4" fill="#6B252A" />
            <circle cx="72" cy="72" r="4" fill="#4E0F16" /><circle cx="86" cy="72" r="4" fill="#6B252A" />
            <circle cx="114" cy="72" r="4" fill="#4E0F16" /><circle cx="142" cy="72" r="4" fill="#6B252A" />
            <circle cx="156" cy="72" r="4" fill="#4E0F16" /><circle cx="170" cy="72" r="4" fill="#6B252A" />
            <circle cx="20" cy="86" r="4" fill="#4E0F16" /><circle cx="48" cy="86" r="4" fill="#6B252A" />
            <circle cx="62" cy="86" r="4" fill="#4E0F16" /><circle cx="138" cy="86" r="4" fill="#4E0F16" />
            <circle cx="166" cy="86" r="4" fill="#6B252A" /><circle cx="180" cy="86" r="4" fill="#4E0F16" />
            <circle cx="34" cy="100" r="4" fill="#6B252A" /><circle cx="62" cy="100" r="4" fill="#6B252A" />
            <circle cx="138" cy="100" r="4" fill="#6B252A" /><circle cx="152" cy="100" r="4" fill="#4E0F16" />
            <circle cx="20" cy="114" r="4" fill="#4E0F16" /><circle cx="48" cy="114" r="4" fill="#6B252A" />
            <circle cx="62" cy="114" r="4" fill="#4E0F16" /><circle cx="76" cy="114" r="4" fill="#6B252A" />
            <circle cx="124" cy="114" r="4" fill="#4E0F16" /><circle cx="138" cy="114" r="4" fill="#6B252A" />
            <circle cx="180" cy="114" r="4" fill="#4E0F16" /><circle cx="20" cy="128" r="4" fill="#6B252A" />
            <circle cx="34" cy="128" r="4" fill="#4E0F16" /><circle cx="76" cy="128" r="4" fill="#4E0F16" />
            <circle cx="90" cy="128" r="4" fill="#6B252A" /><circle cx="104" cy="128" r="4" fill="#4E0F16" />
            <circle cx="118" cy="128" r="4" fill="#6B252A" /><circle cx="146" cy="128" r="4" fill="#4E0F16" />
            <circle cx="160" cy="128" r="4" fill="#6B252A" /><circle cx="174" cy="128" r="4" fill="#4E0F16" />
            <circle cx="72" cy="142" r="4" fill="#6B252A" /><circle cx="100" cy="142" r="4" fill="#4E0F16" />
            <circle cx="114" cy="142" r="4" fill="#6B252A" /><circle cx="142" cy="142" r="4" fill="#4E0F16" />
            <circle cx="170" cy="142" r="4" fill="#6B252A" /><circle cx="86" cy="156" r="4" fill="#4E0F16" />
            <circle cx="114" cy="156" r="4" fill="#4E0F16" /><circle cx="128" cy="156" r="4" fill="#6B252A" />
            <circle cx="156" cy="156" r="4" fill="#4E0F16" /><circle cx="72" cy="170" r="4" fill="#4E0F16" />
            <circle cx="100" cy="170" r="4" fill="#6B252A" /><circle cx="142" cy="170" r="4" fill="#4E0F16" />
            <circle cx="170" cy="170" r="4" fill="#6B252A" /><circle cx="86" cy="184" r="4" fill="#6B252A" />
            <circle cx="114" cy="184" r="4" fill="#4E0F16" /><circle cx="128" cy="184" r="4" fill="#6B252A" />
            <circle cx="156" cy="184" r="4" fill="#4E0F16" /><circle cx="184" cy="184" r="4" fill="#6B252A" />
            {/* Logo central */}
            <rect x="76" y="76" width="48" height="48" rx="10" fill="#FFFFFF" />
            <rect x="80" y="80" width="40" height="40" rx="8" fill="#4E0F16" />
            <text x="100" y="104" textAnchor="middle" fontFamily="Montserrat" fontSize="12" fontWeight="800" fill="#FDA540" letterSpacing="1">UES</text>
          </svg>
        </div>

        <div className="bg-surface-container px-4 py-2 rounded-full flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-secondary">meeting_room</span>
          <p className="font-body-sm text-body-sm font-medium">Presenta este código en el torniquete de entrada</p>
        </div>

        <div className="w-full flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-text-muted">
            <span className="material-symbols-outlined text-[18px] text-secondary">timer</span>
            <span className="font-body-sm text-body-sm">Vigencia:</span>
            <span className="font-label-lg text-label-lg text-primary font-bold">{vigencia}</span>
          </div>
          <button
            onClick={actualizarQr}
            className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold transition-all active:scale-95"
          >
            <span className={`material-symbols-outlined text-[16px] ${girando ? "animate-spin" : ""}`}>sync</span>
            <span>Actualizar</span>
          </button>
        </div>
      </section>

      {/* CTA: Comenzar Rutina */}
      <section className="relative overflow-hidden rounded-xl p-4 shadow-md" style={{ background: "linear-gradient(to right, #fda540, #8a5100)" }}>
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-white/80 font-bold">
              Recomendado para hoy
            </span>
            <h3 className="font-headline-sm text-headline-sm text-white font-bold leading-tight">
              Fuerza &amp; Hipertrofia · Día 3
            </h3>
            <p className="font-body-sm text-body-sm text-white/90">Piernas, Glúteos y Abdominales (55 min)</p>
          </div>
          <a
            href="/dashboard"
            className="shrink-0 w-12 h-12 rounded-full bg-white text-secondary flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform active:scale-90"
          >
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </a>
        </div>
      </section>

      {/* Visitas Recientes */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">history</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Visitas recientes</h3>
          </div>
          <a href="/asistencias" className="font-label-sm text-label-sm text-secondary font-bold hover:underline">
            Ver historial
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Sesión 1 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Ayer</span>
                  <span className="font-body-sm text-body-sm text-text-muted">· 58 min</span>
                </div>
                <span className="font-body-sm text-body-sm text-text-muted truncate">Fuerza y Tren Inferior</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-label-sm text-label-sm font-semibold text-primary">07:30 - 08:28 hrs</span>
              <span className="font-label-sm text-label-sm text-state-success flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">done_all</span> Completado
              </span>
            </div>
          </div>

          {/* Sesión 2 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">directions_run</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Lunes 12</span>
                  <span className="font-body-sm text-body-sm text-text-muted">· 45 min</span>
                </div>
                <span className="font-body-sm text-body-sm text-text-muted truncate">Cardio &amp; Core</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-label-sm text-label-sm font-semibold text-primary">16:10 - 16:55 hrs</span>
              <span className="font-label-sm text-label-sm text-state-success flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">done_all</span> Completado
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}