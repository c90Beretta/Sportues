---
key: tpl
title: "chore(L1): plantillas de issue feature, bug y task"
labels: task,level:L1
---
## Objetivo

Tener plantillas en `.github/ISSUE_TEMPLATE/` para que todo trabajo nazca con criterios de aceptación.

## Criterios de aceptación

**Criterio 1**
- **Given** un integrante abre *New issue* en GitHub
- **When** elige Feature, Bug o Task
- **Then** ve las tres plantillas; Feature y Task incluyen criterios Given / When / Then

**Criterio 2**
- **Given** se elige la plantilla Bug
- **When** se abre el formulario
- **Then** incluye severidad, pasos para reproducir, esperado, actual, evidencia y un "Done when" con prueba de regresión

**Criterio 3**
- **Given** existían `bug-report.yml` y `feature-request.yml`
- **When** se mergea el PR
- **Then** no aparecen plantillas duplicadas en el selector

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Parte del framework de equipo (Team Implementing Framework).

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
