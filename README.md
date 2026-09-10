# Proyecto universitario de gestión de gimnasio

Repositorio único (workspace de npm) con tres aplicaciones y un paquete compartido, todo dentro de un devcontainer.

| Carpeta              | Descripción                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `apps/api`           | API REST con **NestJS**, **Prisma** y **PostgreSQL**                   |
| `apps/admin`         | Panel administrativo (staff) con **Next.js** (App Router)              |
| `apps/web`           | App pública de estudiantes con **Astro** (SSR), **Tailwind** e islas **React** |
| `packages/shared`    | Tipos de dominio y esquemas de validación compartidos (`zod`)          |
| `.devcontainer`      | Entorno de desarrollo (Node 24 + PostgreSQL 16) con Docker Compose     |
| `.github/workflows`  | CI por app con *path filters*                                          |

## Requisitos

- Docker + extensión *Dev Containers* de VS Code (o `devcontainer` CLI).
- No se requiere Node instalado localmente: todo corre dentro del devcontainer.

## Abrir en el devcontainer

1. Cloná el repositorio y abrí la carpeta raíz en VS Code.
2. Comando: **Dev Containers: Reopen in Container**.
3. Al crearse, el contenedor instala dependencias de forma reproducible (`npm ci`), genera el cliente de Prisma y copia `apps/api/.env.example` a `apps/api/.env`.

En el devcontainer:

```bash
npm run setup:db        # sincroniza el schema de Prisma con PostgreSQL
npm run dev             # levanta las tres apps en paralelo
npm run prisma:studio   # (opcional) explorar la base de datos
```

Si querés un usuario de prueba:

```bash
npm run start --workspace=api -- --no-watch  # no es necesario en dev
# Crea un staff/estudiante tocando la API (ver apps/api/README.md)
```

## Apps en desarrollo

| App     | URL                 | Comando             |
| ------- | ------------------- | ------------------- |
| API     | http://localhost:3000 | `npm run start:dev --workspace=api` |
| Admin   | http://localhost:3001 | `npm run dev --workspace=admin` |
| Web     | http://localhost:4321 | `npm run dev --workspace=web` |

Para correr todo junto:

```bash
npm run dev
```

> `npm run dev` primero compila `@gimnasio/shared` (una vez) y luego arranca las tres apps en paralelo con sus modos de watch.

## Variables de entorno

Cada app tiene su `.env` (copiado desde `.env.example` por el devcontainer). Valores clave:

- `apps/api/.env` → `DATABASE_URL=postgresql://usuario:password@db:5432/gimnasio`, `JWT_SECRET`
- `apps/admin/.env` → `API_URL=http://localhost:3000`, `JWT_SECRET`
- `apps/web/.env` → `API_URL=http://localhost:3000`, `JWT_SECRET`

`JWT_SECRET` es el mismo en las tres apps: la API lo firma y las apps lo verifican para validar sesiones.

## Sesiones

- **Admin**: cookie `admin_session` (solo rol `STAFF`).
- **Web**: cookie `web_session` (solo rol `ESTUDIANTE`).
- Son independientes: no se comparten cookies ni tokens entre apps.

## CI

Tres workflows en `.github/workflows/` (`api.yml`, `admin.yml`, `web.yml`). Cada uno corre solo cuando cambian archivos de su app o de `packages/shared`.

## Documentación

- `docs/arquitectura.md` — arquitectura y decisiones de diseño.
- `docs/project-proposal.md` — propuesta del proyecto para el issue de GitHub.
- `docs/pair-log.md` — registro de sesiones reales de pair programming.
- `docs/github-setup.md` — configuración manual de branch protection y tablero.
- README de cada app con instrucciones específicas.
