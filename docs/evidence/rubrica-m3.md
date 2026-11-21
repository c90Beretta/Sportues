# Matriz de trazabilidad — Team Implementing Framework

Estado al 2026-11-21. Esta matriz distingue evidencia GitHub verificable de trabajo pendiente o humano.

| Criterio | Puntos | Evidencia existente | Evidencia faltante | Estado |
|---|---:|---|---|---|
| L0 — hipótesis inicial | Verificar peso oficial | Issue/PR #19, `docs/l0-mindset.md`, opiniones individuales fechadas y hipótesis escrita por el equipo | Reevaluación del 30 nov sin completar | Parcial |
| L1 — issues y templates | Verificar peso oficial | Issue #25 cerrado por PR #26; `feature.md`, `bug.md`, `task.md` | Evidencia de un issue M3 adicional alineado al roadmap | Parcial |
| L2 — tablero y flujo | Verificar peso oficial | `docs/framework.md`, `docs/github-setup.md`, `docs/roadmap.md`; PR #33/#37 utilizan rama, PR, revisión y CI | GitHub Project no existe; falta owner con permisos | Bloqueado |
| L3 — CI y regresiones | Verificar peso oficial | Issue #13 cerrado por PR #30; issues #11/#12 cerrados por PR #37/#33; `ci.yml`, Vitest, Jest, guardrails y test floor | Protección activa de `main` no verificable | Parcial |
| L4 — contexto y sesión | Verificar peso oficial | Tres ADR reales: 0001, 0002, 0003; `docs/evidence/l4-fresh-session.md` con intentos reales | PR #35 abierto; falta ejecución funcional de sesión fresca y respuesta íntegra | Parcial |
| L5 — agentes y dos flujos M3 | Verificar peso oficial | Issue #10 cerrado por PR #36; agentes Copilot y guardrails presentes; PR #37 demuestra issue→rama→PR→revisión humana | Issue #9 abierto; falta un segundo flujo M3 completo y corregido por humanos | Parcial |
| L6 — métricas, retro, experimento, investigación | Verificar peso oficial | `scripts/metrics.mjs` y `docs/metrics.md`; plantilla de retro/L0/experiment; issue #38 abierto | Retro, predicciones, Run A/B, transcripciones, tabla 9 filas, research aplicado y showcase | Pendiente |
| Participación/evidencia individual | Verificar peso oficial | Asignaciones y PR reales visibles en GitHub | Tres issues con flujo completo por integrante no están demostrados para los tres | Parcial |

## Evidencia L5 concreta

- PR #36: issue #10, dos commits, aprobación humana, CI verde, mergeado.
- PR #37: issue #11, dos commits funcionales, revisión humana, mergeado.
- PR #33: issue #12, revisión humana, mergeado.

El PR #32 no sustituye PR #37: conservaba una base incorrecta, incluía trabajo de #12 y el head final tenía una aprobación previa al merge commit.
