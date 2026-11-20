---
key: agents
title: "feat(L5): comandos reutilizables y rol revisor"
labels: task,level:L5
---
## Objetivo

Dejar comandos reutilizables y un rol revisor que evalúe PRs contra la Definition of Done.

## Criterios de aceptación

**Criterio 1**
- **Given** la carpeta `.github/agents/`
- **When** se lista
- **Then** existen los agentes nativos `implementador-issue` y `revisor-pr` con extensión `.agent.md`

**Criterio 2**
- **Given** se invoca el revisor sobre un PR
- **When** termina
- **Then** deja comentarios como sugerencias y no aprueba ni mergea el PR

**Criterio 3**
- **Given** el comando de implementación
- **When** se ejecuta
- **Then** se detiene a pedir aprobación del plan y nunca hace merge

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
