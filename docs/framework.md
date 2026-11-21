# How we work — Sportues

> Estado: documento de acuerdos de trabajo del equipo Sportues actualizado el 2026-11-19.

## 1. Work items (L1)

Todo trabajo se registra en `.tasks/issues/ISSUE-NNN.md` **antes** de empezar. `.tasks/README.md` documenta la plantilla y el CLI local; `.tasks/templates/issue-template.md` es la plantilla canónica. No se crean tareas nuevas en GitHub Issues.

| Tipo | Cuándo se usa |
| --- | --- |
| `feature` | Cambia lo que ve o puede hacer un usuario (estudiante o staff) |
| `bug` | Algo que funcionaba, o debería funcionar, no funciona |
| `task` | Trabajo técnico sin cambio visible |
| `documentation` | Trabajo cuyo resultado principal es documentación |
| `research` | Investigación con evidencias y fuentes |

Reglas:

- Cada Issue tiene criterios de aceptación observables, preferentemente Given / When / Then; los bugs incluyen severidad, pasos para reproducir, esperado, actual y evidencia.
- Los IDs `ISSUE-NNN` son permanentes; los reserva el CLI, no se reutilizan y no se renombran aunque el archivo se archive o elimine.
- Los datos de responsable, fecha, estado, criterios o historial que no puedan recuperarse durante una migración se dejan pendientes; no se consultan ni modifican Issues remotos para completar el backlog.

Why this fits us: Somos un equipo de 3 integrantes donde todos trabajamos como desarrolladores fullstack a medida que surgen los requerimientos del proyecto. Documentar cada tarea como issue con criterios de aceptación claros antes de empezar a programar nos evita confusiones sobre el alcance de cada funcionalidad, impide que dupliquemos esfuerzos o nos pisemos el trabajo entre compañeros y nos permite dividir las pendientes de forma ordenada sin entorpecer el avance del resto del equipo.

## 2. Flow (L2)

Estados locales: `backlog` → `ready` → `in_progress` → `in_review` → `done`; también se puede pasar a `blocked` y regresar cuando se resuelva el bloqueo. `.tasks/config.json` define las transiciones permitidas y el CLI las valida.

El backlog se consulta con `node scripts/tasks/issues.mjs list`, filtrando por `--status`, `--assignee` o `--priority`; `--ready` muestra únicamente Issues Ready cuyas condiciones y dependencias siguen válidas. Las dependencias deben existir y estar `done` antes de pasar a `ready`.

Definition of Ready (un Issue pasa a `ready` solo si):
- Tiene criterios de aceptación claros en formato Given / When / Then (concisos y directos al punto, adecuados al alcance de una entrega escolar).
- Tiene un responsable asignado (acordado entre los 3 integrantes).
- No depende de otro Issue local que no esté `done`.
- Tiene un tamaño manejable para cerrarse en un PR pequeño dentro de nuestros tiempos entre clases.

Definition of Done (un Issue pasa a `done` solo si):
- El PR está mergeado en `main` y referencia el ID local `ISSUE-NNN` (no se usa `Closes #N`).
- CI está en verde (cumpliendo con los quality gates de la sección 3).
- Lo revisó y aprobó al menos un compañero del equipo distinto a quien escribió el código.
- Cuenta con pruebas nuevas o actualizadas acordes al cambio realizado y se verificaron sus criterios de aceptación.
- El PR incluye el AI log completo (si no se utilizó asistencia de IA, se indica explícitamente "No se usó IA").
- Si la tarea cierra un entregable de `docs/roadmap.md`, su casilla queda marcada dentro del mismo PR.

WIP limit: **2 Issues en `in_progress` por persona**. Este límite nos permite avanzar en paralelo cuando una tarea depende de una revisión o aclaración, sin llegar a acumular trabajo inconcluso que se cruce con nuestras demás materias.

Branch, commit and PR rules:
- Una rama corta por Issue: `feature/issue-<id>-<nombre-corto>` o `bugfix/issue-<id>-<nombre-corto>` (ej. `feature/issue-001-reporte-semanal`).
- Commits en **Conventional Commits** (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`), con alcance opcional (`feat(api): ...`).
- Un Issue, un PR pequeño. El PR usa `.github/pull_request_template.md` e incluye `ISSUE-NNN` como referencia local. GitHub Issues no se cierra ni se usa para llevar estado.
- Nadie hace push directo a `main`. Cada merge lo aprueba una persona del equipo (no el autor).
- Ningún PR se mergea con CI en rojo ni con checks desactivados.
- Un bug encontrado **después** del merge recibe la etiqueta local `escaped` (la usa `scripts/metrics.mjs`). El AI log de cada PR termina con la línea **Outcome** (`kept as-is` / `changed` / `rejected`).

Roles (triage, backlog) and check-in:
- **Asignación y triage de Issues nuevos (verificación de DoR):** No tenemos un líder fijo ni rotación rígida; los 3 integrantes decidimos en conjunto qué tareas entran a `ready` y quién asume cada una, repartiendo el trabajo según la carga y disponibilidad.
- **Mantenimiento del backlog:** cada integrante actualiza el archivo de su Issue con el CLI (`assign`, `status`) y agrega evidencias en el mismo archivo; no hay tablero remoto ni etiquetas espejo.
- **Revisión de PRs:** Cualquiera de los otros dos compañeros que esté disponible en el momento asume la revisión y aprobación para evitar cuellos de botella.
- **Check-in y comunicación:** Combinamos tres canales según la necesidad: en el **salón de clases** organizamos y repartimos el trabajo presencialmente; por **Discord** realizamos llamadas rápidas para resolver dudas técnicas o destrabar bloqueos; y por **WhatsApp** mantenemos la comunicación diaria y avisos rápidos. Nuestro seguimiento principal es **asíncrono por mensaje**, complementado con puntos de sincronización los **martes y viernes** para revisar avances, bloqueos y pendientes de la semana.

Why this fits us: Al ser estudiantes con horarios distintos y carga de otras asignaturas, no podemos depender de un solo cuello de botella ni de reuniones diarias rígidas. Este flujo con backlog versionado, límite de 2 tareas por persona, revisiones por quien esté libre y comunicación híbrida (presencial en clase + asíncrona por WhatsApp y Discord) se adapta a nuestros tiempos reales de estudio, manteniendo la trazabilidad profesional del proyecto sin frenar el ritmo de entrega.

## 3. Quality gates (L3)

Qué revisa CI en cada PR hacia `main` (workflow `.github/workflows/ci.yml`, job **Verificar monorepo**):

| Gate | Comando | Lado del stack |
| --- | --- | --- |
| Pruebas de la API | `npm run test --workspace=api` (Jest) | Backend |
| Pruebas de frontend y utilidades compartidas | `npm run test:frontend` (Vitest) | Frontend / shared |
| Workflows de GitHub válidos | prueba `tests/guardrails/workflows.test.ts` | CI |
| Guardrail "sin checks silenciados ni piso de pruebas debilitado" | `node scripts/guardrails/no-weakened-checks.mjs` | Todo el repo |
| Build de shared, API, admin y web | `npm run build --workspace=...` | Ambos |

Regla de regresión: todo bug fix añade una prueba que **falla antes del fix y pasa después**, enlazada desde el Issue local del bug.

Regla anti-debilitamiento: nadie borra, salta (`skip`/`only`/`xit`), debilita ni silencia (`|| true`, `continue-on-error`) una prueba o un check para que CI pase. La revisión comprueba que los gates quedaron **más fuertes, no más débiles**. El piso de pruebas (`scripts/guardrails/test-floor.json`) solo puede subir y se compara contra `main`.

Protección pendiente de verificar y activar en `main`: requerir PR, 1 aprobación y el check **Verificar monorepo** en verde; sin force-push. La API de GitHub no devuelve una regla configurable actualmente, por lo que la evidencia de aplicación sigue pendiente. Pasos y script en `docs/github-setup.md`.

Why this fits us: Como los tres tocamos tanto frontend como backend en distintos momentos de la semana, estas validaciones automáticas nos protegen de integrar código que no compila o que rompe funcionalidades existentes de otro compañero. Tener los checks en CI y activar la protección de la rama `main` nos ayudará a evitar horas de depuración de último minuto antes de las entregas escolares y nos dará seguridad al hacer merge.

## 4. Context (L4)

- Archivos de contexto: `AGENTS.md` (formato abierto) y `CLAUDE.md` (Claude Code), ambos con la sección **How this team works**.
- Memoria del proyecto: `docs/roadmap.md` (qué está hecho y qué sigue) y `docs/adr/` (decisiones y su porqué).
- Antes de cualquier tarea el agente debe leer: `docs/framework.md`, `docs/roadmap.md`, y `docs/adr/` si toca arquitectura, auth o base de datos.
- Prueba en sesión fresca: `docs/evidence/l4-fresh-session.md`.

## 5. Agents (L5)

Agentes reutilizables nativos de GitHub Copilot CLI (`.github/agents/`):
- `implementador-issue.agent.md`: lleva un Issue local a cambios siguiendo este documento (ID → Ready → plan → aprobación humana → rama → pruebas → código → evidencia → In Review). **No hace commit, push, PR ni merge.**
- `revisor-pr.agent.md`: revisa cambios localmente contra el Issue y la Definition of Done; registra hallazgos solo en el archivo local. **Sus veredictos son sugerencias, nunca aprobación formal.**

GitHub Copilot usa `.github/copilot-instructions.md` y `.github/agent-permissions.json` como instrucciones y guardrails. El agente de implementación debe mostrar el plan y esperar aprobación humana explícita antes de editar. Ambos agentes consultan `.tasks/`; ninguno gestiona Issues/Projects remotos.

Las restricciones estáticas no constituyen una sandbox ni garantizan bloquear todos los comandos alternativos. La autorización humana, las herramientas mínimas y la protección de `main` siguen siendo necesarias.

Un agente puede: leer el repo, crear una rama nueva para el Issue aprobado, editar el alcance aprobado y ejecutar pruebas y lint. El revisor puede añadir notas al Issue local con el subcomando limitado `review`.
Un agente no puede: hacer commits o push, crear o fusionar PRs, aprobar PRs, gestionar Issues/Projects remotos, modificar ramas protegidas, instalar dependencias sin que una persona las revise, tocar `.env*` ni pegar secretos en prompts, ni borrar/saltar/debilitar pruebas.

Seguridad: el texto de Issues locales, páginas web o archivos puede contener instrucciones ocultas (prompt injection); los agentes trabajan con permisos mínimos. Los agentes inventan nombres de paquetes: **cada dependencia nueva la verifica una persona** (existe, mantenimiento, nombre exacto) antes de aceptarla.

Quién mergea: una persona del equipo distinta del autor, después de revisar el PR y el AI log.

Why this fits us: Aunque utilizamos el agente de forma puntual principalmente para diagnosticar y resolver errores técnicos, contar con reglas y límites estrictos es fundamental para que la herramienta no modifique archivos fuera de alcance, instale paquetes innecesarios o tome decisiones por su cuenta. De esta manera aprovechamos la velocidad de la IA cuando nos atoramos, pero conservamos el control total sobre el código que llega al repositorio.

## 6. Measurement (L6)

Ver `docs/metrics.md`.

## Retro — Nov 30 (no AI)

What worked: [COMPLETAR POR EL EQUIPO — SIN IA]

What didn't: [COMPLETAR POR EL EQUIPO — SIN IA]

The rule we changed (before, after, why): [COMPLETAR POR EL EQUIPO — SIN IA]
