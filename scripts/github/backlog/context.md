---
key: context
title: "docs(L4): sección How this team works y prueba en sesión fresca"
labels: task,level:L4
---
## Objetivo

Que cualquier agente nuevo conozca las reglas del equipo desde `AGENTS.md` / `CLAUDE.md`.

## Criterios de aceptación

**Criterio 1**
- **Given** `AGENTS.md` y `CLAUDE.md`
- **When** se abren
- **Then** tienen la sección "How this team works" apuntando a `docs/framework.md` y `docs/roadmap.md`

**Criterio 2**
- **Given** una sesión de agente recién abierta, sin historial
- **When** se pregunta "What is the next task and how should I do it?"
- **Then** la respuesta real se guarda en `docs/evidence/l4-fresh-session.md` y cita rama, Closes #, tests y roadmap

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
