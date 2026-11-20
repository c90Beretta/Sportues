---
key: flow
title: "docs(L2): flujo de trabajo, tablero y plantilla de PR"
labels: task,level:L2
---
## Objetivo

Documentar y activar el flujo: estados, DoR, DoD, WIP, reglas de rama/commit/PR, roles y check-in; tablero de GitHub Projects y plantilla de PR con AI log.

## Criterios de aceptación

**Criterio 1**
- **Given** existe `docs/framework.md`
- **When** se lee la sección 2
- **Then** define estados, Definition of Ready, Definition of Done, WIP limit, reglas de ramas/commits/PR y roles

**Criterio 2**
- **Given** existe el tablero en GitHub Projects
- **When** se compara con `docs/framework.md`
- **Then** las columnas son exactamente Backlog, Ready, In progress, In review y Done

**Criterio 3**
- **Given** se abre un PR nuevo
- **When** GitHub carga la plantilla
- **Then** contiene `Closes #`, checklist de verificación y sección AI log

**Criterio 4**
- **Given** el equipo escribe las razones propias
- **When** se revisa cada "Why this fits us"
- **Then** están completadas por personas, sin IA

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
