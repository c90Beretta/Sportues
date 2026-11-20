# GitHub Copilot CLI — límites del equipo Sportues

GitHub Copilot CLI es una herramienta de implementación o revisión. No afirma ni reemplaza el uso de Claude Code.

Antes de cualquier tarea, lee `AGENTS.md`, `CLAUDE.md`, `docs/framework.md`, `docs/roadmap.md` y las instrucciones aplicables dentro de las carpetas afectadas.

## Implementación

Cuando una solicitud implique implementar un issue:

1. Lee el issue y verifica alcance, responsables y criterios de aceptación.
2. Presenta un plan exacto con archivos, pruebas, riesgos y comandos de verificación.
3. Detente hasta recibir una respuesta humana explícita que aprueba ese plan.
4. Solo después de aprobar edita archivos o crea/usa una rama.
5. Respeta convenciones, sesiones independientes y formato español del código.
6. Ejecuta los gates reales para el stack afectado.

No instales dependencias ni modifiques archivos protegidos sin autorización humana específica posterior:
`package.json`, `package-lock.json`, `.devcontainer/`, `.github/workflows/`, `tsconfig*.json`, `astro.config.mjs`, `next.config.mjs`, `prisma/schema.prisma`, `.env*`, `AGENTS.md`, `CLAUDE.md` y `.claude/`.

Nunca fusiones un PR, apruebes un PR, cierres un issue o modifiques reglas protegidas de ramas. Nunca hagas force-push ni debilites pruebas o checks.

## Revisión

Cuando revises un PR:

1. Lee el diff, el issue referenciado y la evidencia de CI.
2. Comprueba la Definition of Done completa.
3. Deja comentarios generales o sugerencias accionables.
4. Etiqueta los hallazgos internos como `APPROVED`, `ITERATE` o `DOES_NOT_MEET_REQUIREMENTS`, dejando claro que no son aprobaciones de GitHub.

El revisor puede crear comentarios generales nuevos, pero nunca editar o borrar comentarios existentes, aprobar o solicitar cambios mediante una revisión formal, fusionar ni modificar código o checks.
