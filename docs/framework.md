# How we work — Sportues

> Estado: documento de acuerdos de trabajo del equipo Sportues actualizado el 2026-11-19.

## 1. Work items (L1)

Todo trabajo se escribe como issue **antes** de empezar. Plantillas en `.github/ISSUE_TEMPLATE/`.

| Tipo | Cuándo se usa | Plantilla | Etiqueta |
| --- | --- | --- | --- |
| Feature | Cambia lo que ve o puede hacer un usuario (estudiante o staff) | `feature.md` | `feature` |
| Bug | Algo que funcionaba, o debería funcionar, no funciona | `bug.md` | `bug` |
| Task | Trabajo técnico o de documentación sin cambio visible (CI, docs, refactor, config) | `task.md` | `task` |

Reglas:

- Todo issue de feature y task tiene **criterios de aceptación en formato Given / When / Then**, observables y verificables.
- Un bug trae severidad, pasos para reproducir, esperado, actual y evidencia. Su "Done when" exige una **prueba de regresión que falle antes del fix**.
- No se crean issues después de mergear el código que los resuelve (GitHub conserva las fechas y se revisan).

Why this fits us: Somos un equipo de 3 integrantes donde todos trabajamos como desarrolladores fullstack a medida que surgen los requerimientos del proyecto. Documentar cada tarea como issue con criterios de aceptación claros antes de empezar a programar nos evita confusiones sobre el alcance de cada funcionalidad, impide que dupliquemos esfuerzos o nos pisemos el trabajo entre compañeros y nos permite dividir las pendientes de forma ordenada sin entorpecer el avance del resto del equipo.

## 2. Flow (L2)

States: Backlog → Ready → In progress → In review → Done

Tablero GitHub Projects: no existe actualmente. Cuando el owner conceda permisos, crear
`Sportues — M3 Framework` y vincularlo a `c90Beretta/Sportues`. Procedimiento reproducible:
`docs/github-project.md`.

Tablero: GitHub Projects del repositorio, una columna por estado. La columna `Status` es la fuente de verdad. Al mover una tarjeta a **In progress** se añade además la etiqueta `in progress` al issue (la usa `scripts/metrics.mjs` para calcular cycle time; ver `docs/metrics.md`).
El Project `Sportues — M3 Framework` todavía no existe: el owner no concedió permisos de creación. El procedimiento reproducible está en `docs/github-project.md`.

Definition of Ready (un issue pasa de Backlog a Ready solo si):
- Tiene criterios de aceptación claros en formato Given / When / Then (concisos y directos al punto, adecuados al alcance de una entrega escolar).
- Tiene un responsable asignado (acordado entre los 3 integrantes).
- No depende de otro issue abierto que impida su desarrollo (sin bloqueos).
- Tiene un tamaño manejable para cerrarse en un PR pequeño dentro de nuestros tiempos entre clases.

Definition of Done (un issue pasa a Done solo si):
- El PR está mergeado en `main` y referencia el issue con `Closes #N`.
- CI está en verde (cumpliendo con los quality gates de la sección 3).
- Lo revisó y aprobó al menos un compañero del equipo distinto a quien escribió el código.
- Cuenta con pruebas nuevas o actualizadas acordes al cambio realizado y se verificaron sus criterios de aceptación.
- El PR incluye el AI log completo (si no se utilizó asistencia de IA, se indica explícitamente "No se usó IA").
- Si la tarea cierra un entregable de `docs/roadmap.md`, su casilla queda marcada dentro del mismo PR.

WIP limit: **2 issues en `In progress` por persona**. Este límite nos permite avanzar en paralelo cuando una tarea depende de una revisión o aclaración, sin llegar a acumular trabajo inconcluso que se cruce con nuestras demás materias.

Branch, commit and PR rules:
- Una rama corta por issue: `feature/<n>-<nombre-corto>` o `bugfix/<n>-<nombre-corto>` (ej. `feature/23-login-form`).
- Commits en **Conventional Commits** (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`), con alcance opcional (`feat(api): ...`).
- Un issue, un PR pequeño. El PR usa `.github/pull_request_template.md` y empieza con `Closes #N`.
- Nadie hace push directo a `main`. Cada merge lo aprueba una persona del equipo (no el autor).
- Ningún PR se mergea con CI en rojo ni con checks desactivados.
- Un bug encontrado **después** del merge recibe la etiqueta `escaped` (la usa `scripts/metrics.mjs`). El AI log de cada PR termina con la línea **Outcome** (`kept as-is` / `changed` / `rejected`).

Roles (triage, board) and check-in:
- **Asignación y triage de issues nuevos (verificación de DoR):** No tenemos un líder fijo ni rotación rígida; los 3 integrantes decidimos en conjunto qué tareas entran a `Ready` y quién asume cada una (generalmente aprovechando cuando coincidimos en clase), repartiendo el trabajo fullstack según la carga y disponibilidad de cada quien.
- **Mantenimiento del tablero:** Responsabilidad individual; cada integrante es responsable de mover sus propias tarjetas entre columnas (`Ready` → `In progress` → `In review`) y colocar la etiqueta `in progress` en tiempo real conforme avanza.
- **Revisión de PRs:** Cualquiera de los otros dos compañeros que esté disponible en el momento asume la revisión y aprobación para evitar cuellos de botella.
- **Check-in y comunicación:** Combinamos tres canales según la necesidad: en el **salón de clases** organizamos y repartimos el trabajo presencialmente; por **Discord** realizamos llamadas rápidas para resolver dudas técnicas o destrabar bloqueos; y por **WhatsApp** mantenemos la comunicación diaria y avisos rápidos. Nuestro seguimiento principal es **asíncrono por mensaje**, complementado con puntos de sincronización los **martes y viernes** para revisar avances, bloqueos y pendientes de la semana.

Why this fits us: Al ser estudiantes con horarios distintos y carga de otras asignaturas, no podemos depender de un solo cuello de botella ni de reuniones diarias rígidas. Este flujo con tablero compartido, límite de 2 tareas por persona, revisiones por quien esté libre y comunicación híbrida (presencial en clase + asíncrona por WhatsApp y Discord) se adapta a nuestros tiempos reales de estudio, manteniendo la trazabilidad profesional del proyecto sin frenar el ritmo de entrega.

## 3. Quality gates (L3)

Qué revisa CI en cada PR hacia `main` (workflow `.github/workflows/ci.yml`, job **Verificar monorepo**):

| Gate | Comando | Lado del stack |
| --- | --- | --- |
| Pruebas de la API | `npm run test --workspace=api` (Jest) | Backend |
| Pruebas de frontend y utilidades compartidas | `npm run test:frontend` (Vitest) | Frontend / shared |
| Workflows de GitHub válidos | prueba `tests/guardrails/workflows.test.ts` | CI |
| Guardrail "sin checks silenciados ni piso de pruebas debilitado" | `node scripts/guardrails/no-weakened-checks.mjs` | Todo el repo |
| Build de shared, API, admin y web | `npm run build --workspace=...` | Ambos |

Regla de regresión: todo bug fix añade una prueba que **falla antes del fix y pasa después**, enlazada desde el issue del bug.

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
- `implementador-issue.agent.md`: lleva un issue a cambios locales siguiendo este documento (plan → aprobación humana → pruebas primero → código → evidencia). **No hace commit, push, PR ni merge.**
- `revisor-pr.agent.md`: revisa un PR contra la Definition of Done solo de forma consultiva. **Sus comentarios y veredictos son sugerencias, nunca aprobación.**

GitHub Copilot CLI usa `.github/copilot-instructions.md` y `.github/agent-permissions.json` como instrucciones y guardrails. El agente de implementación debe mostrar el plan y esperar aprobación humana explícita antes de editar; el agente revisor solo consulta PR/diff y entrega hallazgos humanos.

Las restricciones estáticas no constituyen una sandbox ni garantizan bloquear todos los comandos alternativos. La autorización humana, las herramientas mínimas y la protección de `main` siguen siendo necesarias.

Un agente puede: leer el repo, editar archivos en su rama y ejecutar pruebas y lint.
Un agente no puede: crear o fusionar PRs, aprobar PRs, cerrar issues, modificar ramas protegidas, instalar dependencias sin que una persona las revise, tocar `.env*` ni pegar secretos en prompts, ni borrar/saltar/debilitar pruebas.

Seguridad: el texto de issues, páginas web o archivos puede contener instrucciones ocultas (prompt injection); los agentes trabajan con permisos mínimos. Los agentes inventan nombres de paquetes: **cada dependencia nueva la verifica una persona** (existe, mantenimiento, nombre exacto) antes de aceptarla.

Quién mergea: una persona del equipo distinta del autor, después de revisar el PR y el AI log.

Why this fits us: Aunque utilizamos el agente de forma puntual principalmente para diagnosticar y resolver errores técnicos, contar con reglas y límites estrictos es fundamental para que la herramienta no modifique archivos fuera de alcance, instale paquetes innecesarios o tome decisiones por su cuenta. De esta manera aprovechamos la velocidad de la IA cuando nos atoramos, pero conservamos el control total sobre el código que llega al repositorio.

## 6. Measurement (L6)

Ver `docs/metrics.md`.

## Retro — Nov 30 (no AI)

What worked: [COMPLETAR POR EL EQUIPO — SIN IA]

What didn't: [COMPLETAR POR EL EQUIPO — SIN IA]

The rule we changed (before, after, why): [COMPLETAR POR EL EQUIPO — SIN IA]
