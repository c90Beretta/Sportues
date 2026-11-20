---
key: metrics
title: "docs(L6): métricas con datos reales"
labels: task,level:L6
---
## Objetivo

Calcular las cinco métricas (cycle time, PR size, review rounds, escaped bugs, AI acceptance) con issues y PRs reales.

## Criterios de aceptación

**Criterio 1**
- **Given** existen PRs mergeados con AI log
- **When** se ejecuta `scripts/metrics.mjs`
- **Then** la salida se pega en `docs/metrics.md` sin editar los números

**Criterio 2**
- **Given** hay métricas sin datos suficientes
- **When** se escribe `docs/metrics.md`
- **Then** se indica "sin datos" en vez de estimar

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
