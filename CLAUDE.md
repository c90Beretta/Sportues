# CLAUDE.md

Guía para Claude Code trabajando en el proyecto universitario de **gestión de gimnasio** (`Sportues`). Monorepo de npm con tres apps y un paquete compartido, todo dentro de un devcontainer. Lee esto completo antes de tocar código.

> Nota: el contenido de negocio es el mismo que `AGENTS.md` (usado por otras IAs). Si hay divergencia manda este archivo.

## Mapa del repositorio

| Ruta                 | Qué es                                                        |
| -------------------- | ------------------------------------------------------------- |
| `apps/api`           | API REST: **NestJS 11** + **Prisma** + **PostgreSQL 16**      |
| `apps/admin`         | Panel de **staff**: **Next.js** (App Router, Server Components) |
| `apps/web`           | App de **estudiantes**: **Astro** (SSR, node) + Tailwind + **islas React** |
| `packages/shared`    | Tipos de dominio y esquemas `zod` compartidos (`@gimnasio/shared`) |
| `.devcontainer`      | Devcontainer único: `workspace` (Node 20 + npm) + `db` (postgres:16) |
| `.github/workflows`  | CI por app con path filters                                    |

Devcontainer único a propósito: npm resuelve dependencias desde la raíz del monorepo.

## Comandos

```sh
npm install                        # instala todo el monorepo (desde la raíz)
npm run dev                        # compila shared y levanta api + admin + web en paralelo
npm run build                      # compila shared y las tres apps
npm run setup:db                   # prisma db push (sincroniza schema con PostgreSQL)
npm run prisma:studio              # explorador visual de la BD

npm run start:dev --workspace=api   # api dev en http://localhost:3000
npm run build --workspace=api       # prisma generate + nest build
npm run test --workspace=api        # jest
npm run dev --workspace=admin       # admin dev en http://localhost:3001
npm run build --workspace=admin     # next build (incluye typecheck)
npm run dev --workspace=web         # web dev en http://localhost:4321
npm run build --workspace=web       # astro build
npm run astro --workspace=web -- check # typecheck de types de web
```

Antes de terminar cualquier cambio frontend, corré `npm run build --workspace=<app>` (o `npm run astro --workspace=web -- check`). En la API, añadí specs por cada service nuevo y hacé pasar `npm run test --workspace=api`.

## Idiomas y estilo

- Código, UI y este repo en **español** (`Usuario`, `Membresia`, `crearRutinaSchema`).
- `import type` para tipos. Nunca duplicar tipos fuera de `packages/shared`.
- Sin comentarios salvo que se pidan. Preservar `//#region` cuando existan.
- El gate real es que **compile** (`build`) y, en api, que pasen los tests.

## Reglas de protección (duro)

**No modificar sin preguntar al usuario** (`AskUserQuestion`):

- `package.json`, `package-lock.json`
- `.devcontainer/`, `.github/workflows/`
- `AGENTS.md`, `CLAUDE.md`, `.claude/`
- `tsconfig*.json`, `astro.config.mjs`, `next.config.mjs`, `prisma/schema.prisma`
- `.env*`, puertos o secretos

**No instalar dependencias** sin permiso. Sesiones: `apps/admin` (cookie `admin_session`) y `apps/web` (cookie `web_session`) son independientes; no entremezclar tokens.

---

## Convenciones replicadas (origen: `eventos-react` y `eventos-astro`)

La "estructura de React" que debés **replicar tanto en las islas de `apps/web` como en el panel `apps/admin`**. Mantener estos patrones es obligatorio.

### 1. Modelos — clase por entidad (`src/models/*.model.ts`)

Extienden/implementan los tipos de `@gimnasio/shared` y agregan metadatos de UI/API sin redefinir campos:

```ts
import type { Asistencia } from "@gimnasio/shared";
import { ModeloBase } from "@base/interfaces/models/modelo-base.model";
import type { ModelColumnsType } from "@base/interfaces/models/types/model-columns.type";

export class AsistenciaModel extends ModeloBase implements Asistencia {
  static CLASS_NAME = "Asistencia";
  static BASE_ROUTE = "/asistencias";
  static ENDPOINTS = { DEFAULT: "/asistencias" };
  static EXPAND = { DEFAULT: "estudiante" };
  static COLUMNS: ModelColumnsType[] = [
    { key: "fecha", title: "Fecha" },
    { key: "estudiante", title: "Estudiante" },
  ];
  static fromJson(data: Partial<Asistencia>) { return new AsistenciaModel(data); }
  static fromJsonList(data: Partial<Asistencia>[]) { return data.map((d) => new AsistenciaModel(d)); }
  constructor(partial: Partial<Asistencia> = {}) { super(); Object.assign(this, partial); }
}
```

El `ModeloBase` aporta `id`, `creado`, `modificado`, `fromJson`/`fromJsonList`. Las tablas del admin se generan desde `COLUMNS`.

### 2. Hook HTTP — contrato `useHttp`

Respuesta del API siempre **normalizada** a `Response<T> = { resultado?, mensaje?, errores?, detalle?, paginacion? }`, con notificaciones centralizadas:

- **admin**: `src/hooks/useHttp.ts` envuelve `fetch` a `API_URL` con token de `admin_session` (`lib/auth.ts`, `lib/api.ts`). Métodos `get/post/put/del`, `defaultDelete({modalContent, requestParams})` (confirma en modal y borra) y `downloadFile({endpoint, params})`. Callbacks `onSuccess/onError/onFinish({endpoint, params, body, showNotificacion})`.
- **web**: replicar la clase `HttpService` + singleton `http` de `eventos-astro` (`src/hooks/http.ts`) con `DefaultResponse<T>` (`isError`, `status`, `resultado`), helpers `paramsToQuery` y paginación default `{ limite: 10, pagina: 1, ordenar: "id-desc" }`. Los endpoints Astro (`src/pages/api/*.ts`) leen `web_session` y reenvían al API.
- `IRequestParams = { expand?, ordenar?, limite?, pagina?, buscar?, [key]: any }`.

### 3. Formularios

- Componente `Formulario` por entidad + **inputs base** delgados (`TextInput`, `SelectInput`, `TextAreaInput`, `NumberInput`, `InputPassword`, `DatePicker`) usados dentro de un field con label + error: `<Campo label name error>`.
- **Reglas de validación** reutilizables (admin): `Requerido(msg)`, `Correo(msg)`, `Telefono`, `CURP`, `RFC`, `Minimo/Maximo/Rango`, `LongitudMinima/Maxima`, `ConfirmarContrasena(form,key,msg)`; mensajes en español y regex tipadas.
- La fuente de validación de datos es **`zod` en `@gimnasio/shared`** (cliente admin/web); el API valida con `class-validator`.
- Islas React de `web`: `zodResolver` + `react-hook-form` (o controlado simple si es chico) + feedback `sonner`/inline + estados `cargando/ok/error`.

### 4. Formateo

- **Moneda**: un único `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })` en `constants/currency-formatter.ts` / `lib/format.ts`. Jamás inline.
- **Fechas**: `dayjs` con `locale("es")`, formato `D MMM YYYY, h:mm A`. Evitar `Date` + `toLocaleString` manuales.
- Utilidades puras en `src/utils` / `@base/utils` (`cn`, `formatFecha`, ...).

### 5. Listados (admin)

- Modelo con `COLUMNS` (key + título + render opcional).
- `CrudHeader` (título + botón Agregar).
- `TablaQuery`: paginación desde `paginacion` (`total`, `pagina`, `limite`), búsqueda y orden (`id-desc`, sort por columna).
- `useModelColumns` → columnas reales; columna de acciones con `ActionsButton` (editar/eliminar vía `defaultDelete`).

### 6. Rutas CRUD (admin, App Router)

```
apps/admin/app/<entidad>/
  page.tsx                    # listado: CrudHeader + TablaQuery + useModelColumns
  <entidad>-components/formulario.tsx   # formulario reutilizable
  detalle/page.tsx            # alta/edición: carga el modelo y monta Formulario
```

- Páginas = Server Components con `requireSession` y respuestas tipadas con `@gimnasio/shared`.
- Mutaciones → route handler (`app/api/<entidad>/route.ts`), validación `zod` desde shared y reenvío al API.

---

## Entorno / despliegue

- BD: servicio `db` del devcontainer (`DATABASE_URL=postgresql://usuario:password@db:5432/gimnasio` en `apps/api/.env`).
- `@gimnasio/shared`: build dual (CJS `dist/` + ESM `dist-esm/`). Al cambiar tipos/schemas: `npm run build --workspace=@gimnasio/shared` y luego el build de las apps.
- CI: `api.yml`, `admin.yml`, `web.yml` con path filters sobre `apps/<app>` y `packages/shared`.

## Flujo de agentes

Este repo define agentes en `.claude/agents/` (`orquestador`, `implementador`, `tester`, `reviewer`). El `orquestador` coordina: mejora el prompt, delega al `implementador`, verifica con `tester` (`npm run build` / `npm run test --workspace=api`), juzga con `reviewer` e itera. Úsalo proactivamente; preguntá al usuario antes de tocar configuración.
