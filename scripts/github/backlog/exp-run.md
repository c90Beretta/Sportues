---
key: exp-run
title: "docs(experimento): ejecutar Run A (vibe) y Run B (engineered) y reportar"
labels: task,level:L6
---
## Objetivo

Correr la misma tarea con el mismo agente y modelo en `experiment/vibe` y `experiment/engineered`, y reportar con honestidad.

## Criterios de aceptación

**Criterio 1**
- **Given** la rama `experiment/vibe` con los archivos de contexto renombrados
- **When** se ejecuta la Run A con una sola línea de petición
- **Then** queda guardada la transcripción y no se corrige ni se añaden pruebas a mano

**Criterio 2**
- **Given** la rama `experiment/engineered` con todo el framework
- **When** se ejecuta la Run B
- **Then** queda guardada la transcripción

**Criterio 3**
- **Given** ambas runs terminadas
- **When** se llena la tabla de `docs/experiment.md`
- **Then** están las 9 filas y ningún dato fue inventado

**Criterio 4**
- **Given** la Run A gana en alguna medida
- **When** se reporta
- **Then** se explica por qué ganó y qué costó después

**Criterio 5**
- **Given** solo una run pasa la Definition of Done
- **When** se decide el merge
- **Then** nunca se mergea la Run A tal cual

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
