---
description: Revisa un PR contra la Definition of Done y deja comentarios de asesoría
allowed-tools: Read, Grep, Glob, Bash(gh pr view:*), Bash(gh pr diff:*)
argument-hint: <numero-de-pr>
---

# Revisar PR

Usa GitHub Copilot CLI como revisor. No afirmes que Claude Code fue utilizado.

## Entrada

El número del PR es `$ARGUMENTS`. Si falta, detente y pide el número.

## Evidencia obligatoria

1. Lee `AGENTS.md`, `CLAUDE.md`, `docs/framework.md`, `docs/roadmap.md` y el template `.github/pull_request_template.md`.
2. Ejecuta `gh pr view $ARGUMENTS --repo c90Beretta/Sportues --json number,title,body,state,author,reviewDecision,statusCheckRollup`.
3. Ejecuta `gh pr diff $ARGUMENTS --repo c90Beretta/Sportues`.
4. Inspecciona el issue referenciado por `Closes #N`, sus criterios de aceptación y su evidencia.
5. Comprueba: rama corta, PR pequeño, Closes, CI verde, pruebas, revisión humana distinta del autor, AI log completo, checkbox de roadmap si corresponde y ausencia de debilitamiento.

## Veredicto

Devuelve un veredicto interno claro:

- `APPROVED`: la evidencia cumple; no significa aprobación de GitHub.
- `ITERATE`: hay problemas corregibles y concretos.
- `DOES_NOT_MEET_REQUIREMENTS`: no cumple el objetivo o falta funcionalidad esencial.

El veredicto puede aparecer en texto o comentarios, pero no reemplaza una revisión humana de GitHub.

## Forma de comentar

Deja únicamente comentarios generales o sugerencias en el PR. Cita archivo, línea, criterio o evidencia faltante cuando sea posible.

No uses el comando `gh pr comment`: el patrón `Bash(gh pr comment:*)` no puede restringir opciones como
`--edit-last` o `--delete-last`, por lo que no se considera una capacidad técnica segura.

Produce un borrador de comentario general para que una persona lo revise y publique manualmente.
Está prohibido usar `--edit-last`, `--delete-last`, `--edit`, `--delete`, `--create-if-none`, `--web`,
`gh pr review`, `gh pr merge`, `gh api`, GraphQL o cualquier otro método que envíe aprobación,
solicitud formal de cambios, merge o modificación de comentarios existentes.

No conviertas el veredicto en una revisión formal de GitHub.

## Límites absolutos

- Nunca apruebes el PR.
- Nunca solicites cambios mediante una revisión formal.
- Nunca fusiones el PR.
- Nunca cierres el PR o el issue.
- Nunca cambies archivos como parte de la revisión.
- Nunca desactives CI, checks, reglas de rama o el piso de pruebas.
- Nunca escribas un comentario que presente sugerencias internas como aprobación oficial.
