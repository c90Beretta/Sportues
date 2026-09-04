# AGENTS.md — apps/web (Astro SSR + Tailwind + islas React)

App pública de estudiantes del gimnasio. Es donde **se replican las convenciones de `eventos-astro`**: clase `HttpService` + singleton `http`, modelos como clases, servicios por recurso y formularios con `zodResolver` + react-hook-form.

## Comandos

```fish
npm run dev --workspace=web             # http://localhost:4321
npm run build --workspace=web           # astro build (SSR node, standalone)
npm run astro --workspace=web -- check   # typecheck de types
```

## Stack

- Astro 5 SSR (adaptador `@astrojs/node`), Tailwind CSS (**v3 vía `@astrojs/tailwind`** + `tailwind.config.mjs`), islas React 19.
- Sesión estudiante en cookie `web_session` (JWT verificado con `jose`). No mezclar con `admin_session`.
- `API_URL=http://localhost:3000`, `JWT_SECRET` y `PORT=4321` en `.env` (ver `src/lib/config.ts`).

## Estructura obligatoria

```
src/
  pages/
    <ruta>.astro            # página SSR (exige sesión con getSession)
    api/<recurso>.ts        # endpoint de reenvío al API (lee web_session)
  layouts/Layout.astro
  components/               # islas React (export default) + componentes Astro
  lib/
    config.ts, auth.ts (getSession), api.ts (HttpService/http)
  services/<recurso>.ts     # data fetching por recurso
  models/*.model.ts         # modelos como clases
  styles/global.css         # @tailwind directives
```

## Reglas (convenciones de eventos-astro a mantener)

- **Modelos**: clases `src/models/*.model.ts` que extienden `ModeloBase` e implementan tipos de `@gimnasio/shared`, con estáticos `CLASS_NAME`, `BASE_ROUTE`, `ENDPOINTS.DEFAULT`, `EXPAND.DEFAULT`, `fromJson`/`fromJsonList`. Relaciones con `import type`.
- **HTTP**: replicar la clase `HttpService` + singleton `http` de `eventos-astro` (`src/hooks/http.ts`): `get/post/put/delete/getBlob/postFormData`, respuesta normalizada `DefaultResponse<T>` (`isError`, `status`, `resultado`), helpers `paramsToQuery`, paginación default `{ limite: 10, pagina: 1, ordenar: "id-desc" }`.
- **Data fetching**: `src/services/<recurso>.ts` — función async que usa `http` con `Model.ENDPOINTS.DEFAULT`, hidrata con `Model.fromJsonList(...)` y **devuelve `[]` en error**. Prefiere la capa de servicios; no `http.get` suelto en componentes.
- **Páginas**: render SSR. Para partes interactivas montar islas React. Exigir sesión con `getSession(Astro.cookies)` y redirigir a `/login` si no hay.
- **Endpoints de reenvío** (`src/pages/api/*.ts`): leen `web_session` y reenvían al API con el token; nunca exponer el token al cliente.
- **Formularios (islas)**: `zodResolver` + `react-hook-form` (o formulario controlado simple si es pequeño) con validación desde esquemas `@gimnasio/shared`; feedback con `sonner`/mensajes inline; estados `cargando/ok/error`.
- **Directivas `client:*`** según prioridad/posición: `client:load` (alta), `client:idle` (media), `client:visible`/`client:media` (baja), `client:only="react"` (solo si depende de APIs del navegador).
- **Formatters**: fechas con `dayjs` locale `es` (`D MMM YYYY, h:mm A`); moneda con `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })` centralizado.
- Tipar con `@gimnasio/shared`. Nunca duplicar tipos.

## Referencias reales para imitar

- `src/pages/dashboard.astro` + `src/components/RegistrarAsistencia.tsx` — página SSR con isla interactiva.
- `src/pages/asistencias.astro` — listado SSR con datos de la API.
- `src/components/LoginForm.tsx` — isla de formulario validada con `loginSchema` de shared.
- `src/pages/api/login.ts` — endpoint de reenvío que setea `web_session`.
