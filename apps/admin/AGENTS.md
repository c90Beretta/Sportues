# AGENTS.md — apps/admin (Next.js, App Router)

Panel administrativo (staff) del gimnasio. Es el lugar donde **se replica la estructura de React de `eventos-react`**: modelos como clases, hook `useHttp`, formularios con inputs base y tablas desde `Model.COLUMNS`.

## Comandos

```fish
pnpm --filter admin dev        # http://localhost:3001
pnpm --filter admin build      # next build (incluye typecheck)
```

## Stack

- Next.js 15 App Router + React 19. Server Components por defecto; los formularios son client components.
- Sesión staff en cookie `admin_session` (JWT firmado con `jose`). No mezclar con `web_session`.
- `API_URL=http://localhost:3000` y `JWT_SECRET` en `.env` (ver `lib/config.ts`).

## Estructura obligatoria

```
app/
  <entidad>/page.tsx                 # listado (Server Component)
  <entidad>/<entidad>-components/formulario.tsx
  <entidad>/detalle/page.tsx         # alta/edición
  api/<entidad>/route.ts             # mutaciones (zod + reenvío al API)
  api/login/route.ts, api/logout/route.ts
components/                          # componentes reutilizables (login-form, crear-rutina-form, ...)
lib/                                 # auth.ts (sesión), api.ts (fetch al API), config.ts
src/models/*.model.ts                # modelos (clases con COLUMNS, ENDPOINTS, fromJson)
```

## Reglas (convenciones de eventos-react a mantener)

- **Modelos**: clases `src/models/*.model.ts` que extienden `ModeloBase` (`@base/interfaces/models/modelo-base.model`) e **implementan** los tipos de `@gimnasio/shared` (sin redefinir campos). Estáticos: `CLASS_NAME`, `BASE_ROUTE`, `ENDPOINTS.DEFAULT`, `EXPAND.DEFAULT`, `fromJson`/`fromJsonList`, y `COLUMNS: ModelColumnsType[]` para las tablas.
- **Hook HTTP**: mantener el contrato de `useHttp` (respuesta normalizada `{ resultado, mensaje, errores, detalle, paginacion }`, callbacks `onSuccess/onError/onFinish`, `defaultDelete` con confirmación). En el server, los route handlers reenvían al API con el token de `admin_session`.
- **Listados**: patrón `TablaQuery` (paginación desde `paginacion`, búsqueda, orden `id-desc`) + `CrudHeader` + `useModelColumns` con columna de acciones (`ActionsButton`). Las columnas salen del `COLUMNS` del modelo.
- **Formularios**: componente `Formulario` por entidad + inputs base (`TextInput`, `SelectInput`, `TextAreaInput`, `NumberInput`, `InputPassword`, `DatePicker`) + reglas de validación reutilizables (`Requerido`, `Correo`, `Minimo`, `Rango`, ...) con mensajes en español. Validación de datos con **esquemas `zod` de `@gimnasio/shared`**.
- **Formatters**: moneda con `Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })` centralizado; fechas con `dayjs` locale `es`.
- **Sesión**: páginas = Server Components que exigen sesión con `requireSession()` (`lib/api.ts`) y tipo STAFF; redirecciona a `/login`.
- Tipar respuestas del API con `@gimnasio/shared`. Nunca duplicar tipos.

## Referencias reales para imitar

- `app/estudiantes/page.tsx` — listado simple.
- `app/rutinas/page.tsx` + `components/crear-rutina-form.tsx` — listado + formulario con `crearRutinaSchema` de shared.
- `app/api/login/route.ts` — route handler con validación zod y cookie.