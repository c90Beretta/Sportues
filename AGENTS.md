# AGENTS.md

Proyecto universitario de **gestión de gimnasio** (repo `Sportues`). Monorepo de npm con tres apps y un paquete compartido, todo dentro de un devcontainer.

Este archivo es la fuente de verdad para que cualquier IA (opencode, Claude Code, Cursor, etc.) trabaje en el proyecto. Léelo completo antes de tocar código.

## Mapa del repositorio

| Ruta                 | Qué es                                                        |
| -------------------- | ------------------------------------------------------------- |
| `apps/api`           | API REST: **NestJS 11** + **Prisma** + **PostgreSQL 16**      |
| `apps/admin`         | Panel de **staff**: **Next.js** (App Router, Server Components) |
| `apps/web`           | App de **estudiantes**: **Astro** (SSR, node) + Tailwind + **islas React** |
| `packages/shared`    | Tipos de dominio y esquemas `zod` compartidos (`@gimnasio/shared`) |
| `.devcontainer`      | Devcontainer único: `workspace` (Node 20 + npm) + `db` (postgres:16) |
| `.github/workflows`  | CI por app con path filters                                    |

**Por qué un solo devcontainer**: npm resuelve dependencias desde la raíz del monorepo; un devcontainer por app rompería la resolución de `packages/shared`.

## Comandos

```fish
npm install                  # instala todo el monorepo (desde la raíz)
npm run dev                  # compila shared y levanta api + admin + web en paralelo
npm run build                # compila shared y las tres apps
npm run setup:db             # prisma db push (sincroniza schema con PostgreSQL)
npm run prisma:studio        # explorador visual de la BD
```

Por app (usa `npm run ... --workspace=<nombre>`):

```fish
# api (NestJS + Prisma)
npm run start:dev --workspace=api    # dev con watch en http://localhost:3000
npm run build --workspace=api        # prisma generate + nest build
npm run test --workspace=api         # jest
npm run prisma:generate --workspace=api
npm run prisma:push --workspace=api

# admin (Next.js)
npm run dev --workspace=admin        # dev en http://localhost:3001
npm run build --workspace=admin      # next build (incluye typecheck)

# web (Astro)
npm run dev --workspace=web          # dev en http://localhost:4321
npm run build --workspace=web        # astro build
npm run astro --workspace=web -- check # typecheck de types
```

Verificación rápida de un cambio frontend: correr `npm run build --workspace=<app>` (o el check equivalente) antes de terminar. La API tiene tests con jest (`npm run test --workspace=api`); añade specs por cada service nuevo.

## Idiomas y estilo

- Código, mensajes de UI y este repo: **español** (nombres de tipos/campos en español: `Usuario`, `Membresia`, `crearRutinaSchema`).
- `import type` para tipos (evita carga en runtime cuando solo son tipos).
- Nunca duplicar tipos de dominio fuera de `packages/shared`.
- No hay comentarios salvo que se pidan; cuando un `//#region` aporte orden (patrón base existente) se preserva.
- Idiomas de cada app: ESLint no está configurado en todos; el gate real es que **compile** (`build`) y, en api, que pase `test`.

## Reglas de protección (duro)

**No modifique** sin preguntar al usuario (vía `AskUserQuestion`/pregunta explícita):

- `package.json`, `package-lock.json`
- `.devcontainer/`, `.github/workflows/`
- `AGENTS.md`, `CLAUDE.md`, `.claude/`
- `tsconfig*.json`, `astro.config.mjs`, `next.config.mjs`, `prisma/schema.prisma`
- `.env*`, variables de puertos o secretos

**No instale dependencias** por su cuenta: pregunte primero.

Reglas de sesión: `apps/admin` y `apps/web` tienen **sesiones independientes** (cookies `admin_session` y `web_session`). No entremezclar tokens ni cookies entre apps.

---

## Convenciones replicadas (origen: proyectos `eventos-react` y `eventos-astro`)

El resto de este archivo define la "estructura de React" que hay que **replicar tanto en las islas de React (`apps/web`) como en el panel Next (`apps/admin`)** a partir del stack ya presente en el repo (Tailwind + hooks + modelos). Mantener estos patrones es obligatorio para cualquier feature nueva.

### 1. Modelos (clase por entidad)

Las entidades del dominio viven como **clases** `Nombre.model.ts` que extienden/implementan los tipos de `@gimnasio/shared` y agregan **metadatos de UI/API** (nunca redefinir campos que ya existen en shared — no duplicar tipos).

```ts
// apps/admin/src/models/Asistencia.model.ts (ejemplo de patrón)
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

- En `apps/admin` y `apps/web`: los modelos van en `src/models/*.model.ts`.
- El modelo base (`ModeloBase`) aporta `id`, `creado`, `modificado`, `fromJson`/`fromJsonList` y es la **única** capa que puede tocar shared para mapear.
- Las tablas del admin se generan desde `Model.COLUMNS` (ver sección 5).

### 2. Hook HTTP

Replicar el contrato de `useHttp` de `eventos-react`. La respuesta del API se **normaliza** siempre a `{ resultado, mensaje, errores, detalle, paginacion }` (`Response<T>`), con manejo central de notificaciones:

```ts
// apps/admin/src/hooks/useHttp.ts (contrato a mantener)
export interface IHttpRequest {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: IRequestParams;       // expand, ordenar, limite, pagina, buscar + extras
  showNotificacion?: boolean;
  onSuccess?: (resp: Response) => void;
  onError?: (resp: Response) => void;
  onFinish?: (resp: Response) => void;
}
function useHttp() {
  // get({endpoint, params, onSuccess, onError, onFinish, showNotificacion})
  // post / put / del  → mismos callbacks, incluyen el body
  // defaultDelete({modalContent, requestParams})  → confirma en modal y borra
  // downloadFile({endpoint, params}) → descarga blob
}
```

- **En `apps/admin`** (server-side): el hook envuelve `fetch` a `API_URL` usando el token de la cookie `admin_session` (ver `lib/auth.ts` y `lib/api.ts`). Los route handlers (`app/api/*/route.ts`) reenvían al API.
- **En `apps/web`** (islas React): replicar la **clase** `HttpService` + singleton `http` de `eventos-astro` (`src/hooks/http.ts`) con `DefaultResponse<T>` (`isError`, `status`, `resultado`) y helpers `paramsToQuery`. Los endpoints Astro (`src/pages/api/*.ts`) leen la cookie `web_session` y reenvían al API.
- `IRequestParams` = `{ expand?, ordenar?, limite?, pagina?, buscar?, [key]: any }`. Paginación default `{ limite: 10, pagina: 1, ordenar: "id-desc" }`.

### 3. Formularios

Patrón de formulario por entidad: componente `Formulario` + **input base** + **reglas de validación** reutilizables.

- **Inputs base** (`TextInput`, `SelectInput`, `TextAreaInput`, `NumberInput`, `InputPassword`, `DatePicker`) como componentes delgados que se usan dentro de un field con label + error. En islas (web) y admin mantienen el mismo contrato: `<Campo label name error>`.
- **Reglas de validación**: en el admin replicar el helper de validaciones (`Requerido(msg)`, `Correo(msg)`, `Minimo(n,msg)`, `Maximo`, `Rango`, `LongitudMinima`, `LongitudMaxima`, `ConfirmarContrasena(form,key,msg)`) con mensajes en español y regex tipadas (correo, teléfono, CURP, RFC).
- **Validación de datos**: los esquemas `zod` del paquete `@gimnasio/shared` son la fuente para validar en cliente (admin/web) — usarlos en formularios; el API valida con `class-validator` (DTOs).
- En islas React de `apps/web` usar el patrón canónico de `eventos-astro`: `zodResolver` + `react-hook-form` (o formulario controlado simple si el form es pequeño) + feedback con `sonner`/mensajes inline + estados `cargando`/`ok`/`error`.

### 4. Formateo (formatters)

- **Moneda**: formatter centralizado con `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })` en un único `constants/currency-formatter.ts` (o `lib/format.ts`). Nunca formatear moneda inline.
- **Fechas**: `dayjs` con `locale("es")`, formato `D MMM YYYY, h:mm A`. Evitar `Date` + `toLocaleString` manuales.
- Utilidades puras en `src/utils` / `@base/utils` (`cn`, `formatFecha`, etc.).

### 5. Listados (admin)

Patrón para todo listado CRUD del admin:

- Modelo con `COLUMNS` (key + título + opcional `render`).
- `CrudHeader` (título + botón "Agregar").
- `TablaQuery`: tabla con react-query/fetch, paginación desde `paginacion` de la respuesta (`total`, `pagina`, `limite`), búsqueda y orden (`ordenar: id-desc`, sort por columna).
- `useModelColumns` transforma `COLUMNS` → columnas de tabla; columna de acciones con `ActionsButton` (editar/eliminar, con `defaultDelete`).

### 6. Rutas CRUD (admin, App Router)

Por entidad:

```
apps/admin/app/<entidad>/
  page.tsx                 # listado: CrudHeader + TablaQuery + useModelColumns
  <entidad>-components/
    formulario.tsx         # componente de formulario reutilizable (patrón sección 3)
  detalle/page.tsx         # alta/edición: carga el modelo y monta Formulario
```

- Páginas = Server Components que exigen sesión (`requireSession`) y tipan respuestas con `@gimnasio/shared`.
- Mutaciones → route handler (`app/api/<entidad>/route.ts`) con validación `zod` desde shared y reenvío al API.

---

## Notas de despliegue / entorno

- Base de datos: servicio `db` del devcontainer (`DATABASE_URL=postgresql://usuario:password@db:5432/gimnasio` en `apps/api/.env`).
- `packages/shared`: build dual (CJS `dist/` + ESM `dist-esm/`). Si cambiás tipos/schemas, corré `npm run build --workspace=@gimnasio/shared` y luego el build de las apps.
- CI: cada workflow (`api.yml`, `admin.yml`, `web.yml`) corre solo con cambios en su app o en `packages/shared`. No romper esos gates.
