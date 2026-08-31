# Web (Astro)

App pública para estudiantes del gimnasio, con renderizado en servidor (SSR) y islas de React para las partes interactivas.

## Stack

- Astro 5 con adaptador SSR de Node (`standalone`)
- Tailwind CSS
- Islas de React 19 para interactividad
- Sesión independiente mediante cookie `web_session` (JWT firmado con `jose`)
- Tipos de dominio desde `@gimnasio/shared`

## Paginas

| Ruta                    | Descripción                                            |
| ----------------------- | ------------------------------------------------------ |
| `/login`                | Login de estudiante                                    |
| `/dashboard`            | Rutinas asignadas + check-in de asistencia             |
| `/asistencias`          | Historial de asistencia del estudiante                 |

## Islas de React

- `LoginForm` — formulario de login.
- `RegistrarAsistencia` — check-in diario (envía a `/api/asistencias`).
- `RegistrarEjercicio` — marca un ejercicio de la rutina como completado (por ahora estado local, sin persistencia).

> El formulario de "ejercicio completado" es una demostración de isla; cuando el modelo de datos lo requiera se conecta a un endpoint nuevo.

## Como empezar

```bash
pnpm install                    # desde la raiz del repositorio
pnpm --filter web dev           # http://localhost:4321
```

Requiere `apps/api` corriendo (http://localhost:3000) y la configuración en `.env`:

```
API_URL=http://localhost:3000
JWT_SECRET=dev-secret-cambiar-en-produccion
PORT=4321
```

> La sesión del estudiante usa la cookie `web_session` y es independiente de la cookie `admin_session` de `apps/admin`.

## Build

```bash
pnpm --filter web build
```