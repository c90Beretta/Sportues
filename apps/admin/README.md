# Admin (Next.js)

Panel administrativo del gimnasio para el personal (**STAFF**).

## Stack

- Next.js 15 (App Router, Server Components)
- React 19
- Sesión independiente mediante cookie `admin_session` (JWT firmado con `jose`)
- Tipos de dominio desde `@gimnasio/shared`

## Vistas

| Ruta         | Descripción                                   |
| ------------ | --------------------------------------------- |
| `/login`     | Login de staff (valida rol STAFF)             |
| `/estudiantes` | Listado de estudiantes                      |
| `/asistencias` | Listado de asistencias (filtro `?estudianteId`) |
| `/rutinas`   | Gestión de rutinas: listado y creación         |

## Como empezar

```bash
pnpm install                    # desde la raiz del repositorio
pnpm --filter admin dev         # http://localhost:3001
```

Requiere que `apps/api` esté corriendo (http://localhost:3000) y la configuración en `.env`:

```
API_URL=http://localhost:3000
JWT_SECRET=dev-secret-cambiar-en-produccion
```

> La sesión del admin usa la cookie `admin_session` y es independiente de la cookie `web_session` de `apps/web`.

## Build

```bash
pnpm --filter admin build
```