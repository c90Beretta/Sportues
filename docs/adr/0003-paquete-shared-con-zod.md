# ADR 0003: Paquete compartido `@gimnasio/shared` con tipos y esquemas zod

<!-- Borrador técnico asistido por IA (2026-11-19). El equipo revisó el contexto, la decisión y las consecuencias; el apartado de alternativas fue completado por el equipo a partir de sus recuerdos del proyecto. -->

Date: 2026-08-30 (fecha del primer commit que lo introduce, `491f4a4`)
Status: accepted

## Context

Tres aplicaciones TypeScript (API, admin y web) manejan las mismas entidades (`Usuario`, `Rutina`, `Ejercicio`, `Asistencia`). Sin un lugar común, cada app definiría sus propios tipos y reglas de validación, y se desalinearían.

## Decision

Un workspace de npm `packages/shared` (`@gimnasio/shared`) con los tipos de dominio y esquemas `zod`. Es la **única fuente de verdad de tipos**; las apps no los duplican (`import type`). Los clientes (admin y web) validan formularios con esos esquemas; la API valida sus DTOs con `class-validator`. Se compila a doble salida (CJS en `dist/` y ESM en `dist-esm/`).

## Alternatives considered

El mismo compañero creo el paquete compartido como parte de la arquitectura inicial; nosotros aceptamos y trabajamos con el para aprender ese enfoque. Cabe aclarar que no hubo una comparacion formal de alternativas.

## Consequences

- Más fácil: un cambio de tipo se ve a la vez en las tres apps; las reglas de formularios tienen un solo lugar y se pueden probar sin levantar ninguna app (`tests/shared/`).
- Más difícil: al cambiar `packages/shared` hay que reconstruirlo (`npm run build --workspace=@gimnasio/shared`) antes de compilar las apps; el CI ya lo hace.
- Vigilar: las reglas de validación existen dos veces (esquemas zod en shared y DTOs `class-validator` en la API) y pueden divergir. `npm audit` reporta hoy una vulnerabilidad alta en `zod` (versión anterior a 4.6.6; GHSA-mrhx-c7xc-m3w5); actualizar es un cambio mayor y debe hacerse con su propio issue.
