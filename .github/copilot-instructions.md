# GitHub Copilot — límites del equipo Sportues

El equipo comparte agentes personalizados para trabajar con GitHub Copilot Chat en VS Code. Para instalarlo, iniciar sesión y seleccionar `implementador-issue` o `revisor-pr`, sigue [`docs/onboarding.md`](../docs/onboarding.md). Las personas sin Copilot pueden ejecutar, probar y revisar el repositorio manualmente.

Antes de cualquier tarea, lee `AGENTS.md`, `docs/framework.md`, `docs/roadmap.md` y las instrucciones aplicables dentro de las carpetas afectadas.

## Implementación

Cuando una solicitud implique implementar un issue:

1. Lee el issue y verifica alcance, responsables y criterios de aceptación.
2. Presenta un plan exacto con archivos, pruebas, riesgos y comandos de verificación.
3. Pregunta explícitamente si el plan fue aprobado y detente.
4. Solo después de una aprobación humana explícita edita archivos.
5. Respeta convenciones, sesiones independientes y formato español del código.
6. Ejecuta los gates reales para el stack afectado.

No instales dependencias ni modifiques archivos protegidos sin autorización humana específica posterior:
`package.json`, `package-lock.json`, `.devcontainer/`, `.github/workflows/`, `tsconfig*.json`, `astro.config.mjs`, `next.config.mjs`, `prisma/schema.prisma`, `.env*`, `AGENTS.md` y `.claude/`.

Nunca fusiones un PR, apruebes un PR, cierres un issue o modifiques reglas protegidas de ramas. Nunca hagas force-push ni debilites pruebas o checks.

## Revisión

Cuando revises un PR:

1. Lee el diff, el issue referenciado y la evidencia de CI.
2. Comprueba la Definition of Done completa.
3. Entrega al usuario hallazgos accionables y aspectos correctos; no publiques comentarios ni reviews en GitHub.
4. Etiqueta el veredicto interno como `APPROVED`, `ITERATE` o `DOES_NOT_MEET_REQUIREMENTS`, aclarando que nunca es una aprobación de GitHub.

El revisor no modifica archivos o checks, no aprueba, no solicita cambios formalmente, no cierra ni fusiona issues o PRs. La revisión formal y cualquier acción en GitHub corresponden a una persona autorizada distinta del autor.

## Agentes y límites

- `implementador-issue` trabaja en el alcance aprobado y espera aprobación humana explícita del plan antes de editar. La aprobación del plan no autoriza cambios a archivos protegidos ni instalaciones: esas acciones requieren autorización específica adicional.
- `revisor-pr` es exclusivamente consultivo. Si el entorno no proporciona acceso de lectura al PR, pide que se adjunten el diff, el issue y el estado de CI; no sustituyas ese contexto por operaciones de escritura.
- No hagas commits, push, creación de PR, aprobación ni merge salvo autorización humana específica para una tarea y solo cuando el rol y las reglas aplicables lo permitan. Estos agentes no están autorizados a aprobar o fusionar su propio trabajo.
- `.github/agent-permissions.json` y estas instrucciones son guardrails orientativos, no un sandbox ni una garantía de aislamiento. Comprueba las herramientas realmente disponibles y revisa toda operación y resultado.
