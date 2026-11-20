---
key: adr
title: "docs(L4): al menos 2 ADRs de decisiones reales del proyecto"
labels: task,level:L4
---
## Objetivo

Registrar decisiones reales (base de datos, autenticación, tipos compartidos) en `docs/adr/`.

## Criterios de aceptación

**Criterio 1**
- **Given** existen `docs/adr/0001-*.md` y `0002-*.md`
- **When** se leen
- **Then** cada uno sigue la plantilla (Date, Status, Context, Decision, Alternatives, Consequences) y describe una decisión que sí existe en el código

**Criterio 2**
- **Given** la sección "Alternatives considered"
- **When** se revisa
- **Then** la escribió el equipo con lo que realmente evaluó

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
