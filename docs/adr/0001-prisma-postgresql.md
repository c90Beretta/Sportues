# ADR 0001: Prisma sobre PostgreSQL como capa de persistencia
<!-- Borrador técnico asistido por IA (2026-11-19). El equipo revisó el contexto, la decisión y las consecuencias; el apartado de alternativas fue completado por el equipo a partir de sus recuerdos del proyecto. -->

Date: 2026-08-30 (fecha del primer commit que lo introduce, `491f4a4`; el esquema se rediseñó el 2026-09-27)
Status: accepted

## Context

La API necesita guardar usuarios, rutinas, ejercicios, equipo y asistencias con relaciones entre ellos (`apps/api/prisma/schema.prisma`). El devcontainer ya levanta un servicio `db` con `postgres:16` y la API es NestJS (TypeScript). El esquema cambió de forma importante el 2026-09-27 (commit `c3e4cd6`: se quitaron membresías y se añadieron inventario de equipo y acceso por QR).

## Decision

Usar **Prisma** como ORM sobre **PostgreSQL 16**. La API accede a los datos solo mediante `PrismaService`. En desarrollo el esquema se sincroniza con `npm run setup:db` (`prisma db push`).

## Alternatives considered

No hubo una comparación formal de alternativas: el compañero propuso Prisma y PostgreSQL por su experiencia, el equipo estuvo de acuerdo y decidió aprender esas tecnologías para trabajar con herramientas profesionales.

## Consequences

- Más fácil: tipos generados desde el esquema, y los servicios se prueban en Jest sustituyendo `PrismaService` por un mock (patrón de `ejercicios.service.spec.ts`).
- Más difícil: `prisma generate` debe correr antes de compilar o probar la API (ya está en los scripts `build` y `test`), y necesita descargar binarios de Prisma.
- Vigilar: el repo mezcla `db push` (flujo de `setup:db`) con una migración versionada (`20260927182005_redesign_schema`), mientras `DOKPLOY.md` afirma que aún no hay migraciones versionadas. Hay que decidir y documentar un solo flujo antes de tocar datos reales.
- `prisma/schema.prisma` es un archivo protegido para los agentes: no se cambia sin autorización de una persona.
