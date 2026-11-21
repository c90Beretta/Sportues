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

- Git, Docker con Docker Compose, VS Code y la extensión *Dev Containers*.
- No se requiere Node instalado en el equipo anfitrión si usás el Dev Container; el contenedor usa Node 24 y npm.
- Consulta la [guía de onboarding](docs/onboarding.md) para instalación, variables de entorno, pruebas, producción y agentes de Copilot.

## Abrir en el devcontainer

1. Cloná el repositorio y abrí la carpeta raíz en VS Code.
2. Comando: **Dev Containers: Reopen in Container**.
3. Al crearse, el contenedor ejecuta `npm ci`, compila `@gimnasio/shared`, genera Prisma Client y copia `apps/api/.env.example` a `apps/api/.env` solo si ese archivo aún no existe. No copia automáticamente los ejemplos de Admin ni Web.

En el devcontainer:

```bash
npm run setup:db        # sincroniza el schema de Prisma con PostgreSQL
npm run dev             # levanta las tres apps en paralelo
npm run prisma:studio   # (opcional) explorar la base de datos
npm run test:frontend   # Vitest
npm run test --workspace=api
npm run build
```

Verificación del entorno compartido:

```bash
node --version
git --version
psql "$DATABASE_URL" -c "select 1;"
```

Si querés un usuario de prueba:

```bash
npm run seed:admin
```

El seed crea el administrador y los registros de padrón de prueba. Configurá `ADMIN_NOMBRE`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno del proceso antes de ejecutarlo; no uses sus valores predeterminados fuera de una base local desechable.

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

Los ejemplos de entorno están en cada app, pero el setup automático solo copia el de API. Compose proporciona `DATABASE_URL`, `JWT_SECRET` y `PORT` al contenedor de trabajo. Valores clave:

- `apps/api/.env` → `DATABASE_URL`, `JWT_SECRET`
- `apps/admin/.env` → `API_URL=http://localhost:3000`, `JWT_SECRET`
- `apps/web/.env` → `API_URL=http://localhost:3000`, `JWT_SECRET`

`JWT_SECRET` es el mismo en las tres apps: la API lo firma y las apps lo verifican para validar sesiones.

Los valores de ejemplo y Compose son solo para desarrollo local. Para una configuración detallada, incluida la ejecución desde el host y producción, consulta [docs/onboarding.md](docs/onboarding.md).

## Sesiones

- **Admin**: cookie `admin_session` (solo rol `STAFF`).
- **Web**: cookie `web_session` (solo rol `ESTUDIANTE`).
- Son independientes: no se comparten cookies ni tokens entre apps.

## CI

Tres workflows en `.github/workflows/` (`api.yml`, `admin.yml`, `web.yml`). Cada uno corre solo cuando cambian archivos de su app o de `packages/shared`.

## Gestión local de Issues

El backlog canónico está en [`.tasks/`](.tasks/README.md), versionado con Git. Después de clonar el repositorio, no necesitas tokens, permisos de Issues/Projects ni acceso a la API de GitHub para crear, consultar, asignar o actualizar tareas.

```bash
node scripts/tasks/issues.mjs list
node scripts/tasks/issues.mjs create --title "Agregar reporte semanal" --type feature --priority medium
node scripts/tasks/issues.mjs show ISSUE-001
node scripts/tasks/issues.mjs check
```

Consulta [`.tasks/README.md`](.tasks/README.md) para filtrar, asignar, cambiar estados, revisar dependencias y archivar. Las referencias GitHub existentes se conservan solo como historial o en `github_issue` al migrar; no se consultan ni modifican remotamente.

## Documentación

- `docs/onboarding.md` — instalación, ejecución, pruebas, solución de problemas y Copilot Chat.
- `docs/arquitectura.md` — arquitectura y decisiones de diseño.
- `docs/project-proposal.md` — propuesta del proyecto.
- `docs/pair-log.md` — registro de sesiones reales de pair programming.
- `docs/github-setup.md` — configuración manual de branch protection; el backlog ya no usa GitHub Projects.
- README de cada app con instrucciones específicas.
