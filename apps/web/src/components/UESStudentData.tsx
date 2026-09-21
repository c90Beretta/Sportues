interface Props {
  folio: string;
  carrera: string;
  onFolioChange: (valor: string) => void;
  onCarreraChange: (valor: string) => void;
}

const CARRERAS = [
  "Ing. Ambiental",
  "Ing. Biomedica",
  "Ing. Biotecnologia Acuatica",
  "Ing. Geociencias",
  "Ing. Horticultura",
  "Ing. Industrial En Manufactura",
  "Ing. Mecatronica",
  "Ing. Software",
  "Ing. Tecnologia De Alimentos",

  "Lic. Administracion De Empresas",
  "Lic. Administracion De Empresas Turisticas",
  "Lic. Agronegocios",
  "Lic. Comercio Internacional",
  "Lic. Contaduria",
  "Lic. Criminologia",
  "Lic. Ecologia",
  "Lic. Enfermeria",
  "Lic. Enseñanza De Ingles",
  "Lic. Entrenamiento Deportivo",
  "Lic. Finanzas E Inversiones",
  "Lic. Fisioterapia",
  "Lic. Gestion Y Desarrollo De Negocios",
  "Lic. Medicina General Y Comunitaria",
  "Lic. Nutricion Humana",
];

export default function DatosAlumnoUES({ folio, carrera, onFolioChange, onCarreraChange }: Props) {
  const folioValido = /^\d{11}$/.test(folio);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-xl">badge</span>
        </div>
        <div>
          <h2 className="font-heading text-headline-sm text-text-primary leading-tight">Datos de Alumno UES</h2>
          <p className="text-body-sm text-text-muted">Vinculación con tu matrícula institucional</p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 mb-4">
        <span className="flex items-center justify-between">
          <span className="text-label-md font-heading text-text-primary">
            No de expediente  <span className="text-state-error">*</span>
          </span>
          {folioValido && (
            <span className="inline-flex items-center gap-1 text-state-success text-label-sm bg-state-success/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-state-success"></span>
              Válido
            </span>
          )}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={folio}
          onChange={(e) => onFolioChange(e.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="11 dígitos, ejemplo: 23020220070"
          required
          className="w-full h-12 px-4 rounded-lg bg-background text-text-primary text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container"
        />
        {folioValido && (
          <p className="text-body-sm text-state-success flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Verificado en la base de datos de la Universidad Estatal de Sonora
          </p>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-heading text-text-primary">
          Carrera y Unidad Académica <span className="text-state-error">*</span>
        </span>
        <select
          value={carrera}
          onChange={(e) => onCarreraChange(e.target.value)}
          required
          className="w-full h-12 px-4 rounded-lg bg-background text-text-primary text-body-md outline-none shadow-sm ring-1 ring-outline/25 focus:ring-2 focus:ring-secondary-container"
        >
          <option value="" disabled>Selecciona tu carrera</option>
          {CARRERAS.map((c) => (
            <option key={c} value={c}>{c} · Campus Hermosillo</option>
          ))}
        </select>
      </label>
    </section>
  );
}