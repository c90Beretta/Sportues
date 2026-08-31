# Arquitectura

## Vista general

Repositorio único (workspace de pnpm) con tres aplicaciones y un paquete de código compartido.

```
┌──────────────────────────────────────────────────┐
│                Devcontainer (raíz)               │
│   docker-compose: workspace (Node 20) + db (PG16)│
└────────────────────┬─────────────────────────────┘
                     │
   ┌─────────────────┼──────────────────────┐
   │                 │                      │
apps/api            apps/admin            apps/web
(NestJS + Prisma)   (Next.js App Router)  (Astro SSR + Tailwind)
   │                 │                      │
   └─────────────► packages/shared ◄────────┘
                  (tipos + zod)
```

## Decisiones principales

- **Workspace único**: `pnpm-workspace.yaml` cubre `apps/*` y `packages/*`. pnpm resuelve dependencias desde la raíz, por eso el devcontainer es único y no uno por app.
- **`@gimnasio/shared`**: tipos de dominio (`Usuario`, `Membresia`, `Rutina`, `Ejercicio`, `Asistencia`) y esquemas de validación con `zod`. Es la única fuente de verdad de tipos; las apps no duplican tipos.
- **Autenticación independiente**: la API firma JWT. `apps/admin` guarda el token en la cookie `admin_session` y `apps/web` en la cookie `web_session`. No se comparten cookies ni tokens entre ambas.
- **Validación**: la API valida con `class-validator`; `zod` se usa en el paquete compartido y para validación en los clientes (admin y web).
- **Sin herramientas pesadas**: no hay Turborepo, Nx ni Lerna. Solo workspaces de pnpm + scripts.

## Flujo de datos

1. `apps/web` y `apps/admin` comunican con `apps/api` por HTTP (`Fetch API`).
2. `apps/api` usa Prisma para leer/escribir en PostgreSQL (`db`).
3. Las respuestas de la API se tipan con los tipos de `packages/shared`, que también se consumen del lado cliente para validar formularios.

## CI

Tres workflows (`api.yml`, `admin.yml`, `web.yml`) con *path filters*: solo corren cuando cambian archivos de `apps/<app>` o de `packages/shared`. Cada uno compila su app:

- `api.yml` → `pnpm --filter api build` + `pnpm --filter api test`
- `admin.yml` → `pnpm --filter admin build`
- `web.yml` → `pnpm --filter web build`