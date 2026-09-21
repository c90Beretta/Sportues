interface Props {
  archivo: string | null;
  onArchivoChange: (nombre: string | null) => void;
}

export default function CertificadoMedico({ archivo, onArchivoChange }: Props) {
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    onArchivoChange(file ? file.name : null);
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-xl">medical_services</span>
        </div>
        <div>
          <h2 className="font-heading text-headline-sm text-text-primary leading-tight">
            Certificado Médico <span className="text-state-error">*</span>
          </h2>
        </div>
      </div>

      <label htmlFor="certificado" className="group cursor-pointer bg-background hover:bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all">
        <input id="certificado" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFileChange} className="hidden" />
        <div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary mb-2">
          <span className="material-symbols-outlined text-[26px]">upload_file</span>
        </div>
        {archivo ? (
          <p className="text-label-md font-heading text-state-success">{archivo} · listo</p>
        ) : (
          <>
            <p className="text-label-lg font-heading text-text-primary font-bold">Subir certificado médico o constancia de salud</p>
            <p className="text-body-sm text-text-muted mt-0.5">PDF, JPG o PNG hasta 10MB</p>
          </>
        )}
      </label>
    </section>
  );
}