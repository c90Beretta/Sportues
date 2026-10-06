// Mount point for the "create personal routine" builder (foundation).
// Next step for a teammate: fetch the exercise catalog (GET /ejercicios),
// let the student compose exercises with sets/reps/rest, then POST /rutinas
// using crearRutinaSchema from @gimnasio/shared. The submit must go through
// a route handler in src/pages/api/ so the web_session token never reaches
// the client (same pattern as /api/asistencias).
export default function CrearRutina() {
  return (
    <div className="ues-card empty-state">
      <strong>Constructor en construcción</strong>
      <p>
        Aquí podrás armar tu rutina: elige los ejercicios, define series y
        repeticiones, y guarda tu plan personal.
      </p>
    </div>
  );
}