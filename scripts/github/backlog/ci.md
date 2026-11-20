---
key: ci
title: "ci(L3): pruebas en ambos lados del stack y guardrail anti-debilitamiento"
labels: task,level:L3
---
## Objetivo

Que CI ejecute pruebas de backend y de frontend en cada PR y que al menos un guardrail impida debilitar los checks.

## Criterios de aceptación

**Criterio 1**
- **Given** un PR hacia `main`
- **When** corre el workflow CI
- **Then** se ejecutan pruebas de API (Jest) y de frontend/shared (Vitest)

**Criterio 2**
- **Given** un PR añade `it.skip`, `|| true` o `continue-on-error: true`
- **When** corre el guardrail
- **Then** CI falla y explica qué línea lo causó

**Criterio 3**
- **Given** un PR reduce el número de pruebas por debajo del piso en `main`
- **When** corre el guardrail
- **Then** CI falla

**Criterio 4**
- **Given** un workflow tiene YAML inválido
- **When** corre la prueba de workflows
- **Then** CI falla

## Fuera de alcance

Trabajo de producto de M3 (tiene sus propios issues).

## Notas

Auditoría de dependencias: hoy `npm audit` reporta vulnerabilidades altas y críticas, por lo que no se activa como gate bloqueante en este issue (un gate permanentemente en rojo o silenciado no sirve). Abrir issue aparte para remediarlas.

## Definition of Ready

- [ ] Tiene criterios de aceptación (Given / When / Then)
- [ ] Tiene responsable asignado (**asignarlo antes de mover a Ready**)
- [ ] No tiene bloqueos abiertos
