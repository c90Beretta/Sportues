---
key: agentprs
title: "feat(L5): 2 issues de M3 llevados de issue a PR por un agente"
labels: task,level:L5
---
## Objetivo

Elegir 2 issues de producto reales de M3, asignarlos a un agente, y revisar/corregir sus PRs como equipo.

## Criterios de aceptación

**Criterio 1**
- **Given** dos issues de producto con criterios y Definition of Ready
- **When** un agente los implementa
- **Then** cada uno produce un PR con `Closes #N`

**Criterio 2**
- **Given** los PRs del agente
- **When** el equipo los revisa
- **Then** hay comentarios/cambios humanos antes del merge y el AI log dice qué se corrigió

**Criterio 3**
- **Given** ambos PRs
- **When** se mergean
- **Then** cada merge fue aprobado por una persona distinta del autor humano que lo lanzó

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Los dos issues deben ser trabajo de producto real y existir antes de lanzar al agente.

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
