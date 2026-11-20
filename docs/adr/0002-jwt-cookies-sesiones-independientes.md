# ADR 0002: JWT firmado por la API y sesiones independientes en admin y web

<!-- Borrador técnico asistido por IA (2026-11-19). El equipo revisó el contexto, la decisión y las consecuencias; el apartado de alternativas fue completado por el equipo a partir de sus recuerdos del proyecto. -->

Date: 2026-08-30 (fecha del primer commit que lo introduce, `491f4a4`)
Status: accepted

## Context

Hay dos aplicaciones de cara al usuario con públicos distintos: el panel de staff (`apps/admin`, Next.js) y la app de estudiantes (`apps/web`, Astro SSR). Ambas hablan con la misma API (`apps/api`, NestJS).

## Decision

- La API valida credenciales y **firma un JWT** (8 h en el login; 1 h en el registro, que no es un login real todavía).
- Cada app guarda el token en **su propia cookie**: `admin_session` (solo rol `STAFF`) y `web_session` (solo rol `ESTUDIANTE`), con `httpOnly`, `sameSite: "lax"`, `secure` en producción y `maxAge` de 8 h. No se comparten cookies ni tokens entre apps.
- La API y las dos apps usan el **mismo `JWT_SECRET`**: la API firma y las apps verifican (`jose`) para validar sesiones.
- El rol se comprueba en los handlers de login de cada app (y en los guards de la API con `@Public()` / `@Roles(...)`).

## Alternatives considered

Nuestro compañero propuso JWT y cookies por su experiencia, nos explico como funcionaban y nosotros aceptamos aprender y trabajar con esa solucion. Cabe aclarar que no se realizaron comparaciones formales de alternativas.

## Consequences

- Más fácil: un staff y un estudiante pueden tener sesión a la vez en el mismo navegador sin pisarse; las apps validan la sesión sin llamar a la API en cada página.
- Más difícil: el `JWT_SECRET` debe ser idéntico en tres despliegues (`DOKPLOY.md`), y rotarlo invalida todas las sesiones. Un token no se puede revocar antes de que expire.
- Vigilar: el bug "secreto JWT por defecto escrito en el código" (ver el issue del bug) mostraba que la seguridad de todo este diseño depende de ese secreto. La comprobación de rol en el login de admin tiene un comentario `todo: esto deberia ser middleware` (`apps/admin/app/api/login/route.ts`).
