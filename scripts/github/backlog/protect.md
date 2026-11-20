---
key: protect
title: "chore(L3): protección de la rama main"
labels: task,level:L3
---
## Objetivo

Que `main` solo acepte cambios por PR con CI verde y una aprobación.

## Criterios de aceptación

**Criterio 1**
- **Given** existe la regla de protección de `main`
- **When** alguien intenta hacer push directo
- **Then** GitHub lo rechaza

**Criterio 2**
- **Given** un PR con CI en rojo
- **When** se intenta mergear
- **Then** el botón de merge está bloqueado

**Criterio 3**
- **Given** no hay permisos de admin
- **When** se adjunta evidencia
- **Then** hay una captura o la guía de `docs/github-setup.md` con quién debe aplicarla

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
