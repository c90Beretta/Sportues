---
id: ISSUE-001
title: "Refactorizar la gestión de trabajo a Issues locales en Markdown"
type: feature
status: in_review
priority: high
labels:
  - workflow
  - local-issues
assignees: []
created_at: 2026-11-21
updated_at: 2026-11-21
due_date: null
milestone: null
related_issues: []
dependencies: []
github_issue: null
---

# ISSUE-001 · Refactorizar la gestión de trabajo a Issues locales en Markdown

## Descripción
Gestionar tareas del proyecto desde archivos Markdown versionados, sin depender de GitHub Issues, Projects o su API.

## Contexto
El repositorio no tenía un gestor local. La migración debe preservar las referencias remotas existentes sin consultar ni cambiar los Issues de GitHub.

## Criterios de aceptación
- **Given** el repositorio clonado sin credenciales de GitHub, **When** se listan y consultan Issues, **Then** el backlog local funciona desde archivos versionados.
- **Given** un Issue local válido, **When** se crea, cambia de estado, asigna o archiva, **Then** se validan sus datos y dependencias sin sobrescribir otro Issue ni reutilizar su identificador.
- **Given** los agentes de implementación y revisión, **When** se invocan con un identificador local, **Then** usan `.tasks/issues/` y no consultan ni modifican Issues o Projects remotos.
- **Given** la migración de referencias antiguas, **When** faltan datos de responsable, fecha, criterios o estado, **Then** quedan explícitamente pendientes y no se inventan.
- **Given** el código y documentación del gestor local, **When** se ejecutan las pruebas y validaciones documentadas, **Then** pasan y explican cómo crear, consultar, asignar, actualizar y archivar Issues.

## Definition of Ready
- [x] Criterios de aceptación definidos.
- [ ] Responsable asignado.
- [x] Sin bloqueos pendientes.

## Definition of Done
- [x] Implementación terminada.
- [x] Pruebas aprobadas.
- [x] Documentación actualizada.
- [ ] Revisión humana completada.

## Plan de implementación
Gestor Node.js local, guardrails, agentes y documentación implementados conforme al plan aprobado. Las métricas futuras consultan Issues `escaped` locales; el histórico de GitHub se conservó.

## Evidencias
- `npm run test:frontend` — PASS: 7 archivos, 69 pruebas.
- `node scripts/tasks/issues.mjs check` — PASS: 2 Issues válidos.
- `node scripts/tasks/issues.mjs list --ready` — PASS: sin Issues listos para iniciar.
- `git diff --check` — PASS.
- Implementación: `scripts/tasks/issues.mjs`.
- Pruebas: `tests/tasks/local-issues.test.ts`.

## Historial
- 2026-11-21: Issue inicial creado durante la instalación del gestor local.
- 2026-11-21: Implementación, documentación y pruebas terminadas; se pasa a in_review, pendiente de revisión humana.
