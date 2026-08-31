# AGENTS.md — packages/shared (@gimnasio/shared)

Paquete de TypeScript puro con los **tipos de dominio** y **esquemas de validación `zod`** compartidos por `apps/api`, `apps/admin` y `apps/web`. Es la única fuente de verdad de tipos: ninguna app debe duplicarlos.

## Comandos

```fish
pnpm --filter @gimnasio/shared build   # compila dist/ (CJS) + dist-esm/ (ESM)
```

## Estructura

```
src/
  index.ts                  # re-exporta todo
  usuarios.ts               # Usuario, rolUsuarioSchema, loginSchema, crearUsuarioSchema, ...
  membresias.ts             # Membresia
  rutinas.ts                # Rutina, ejerciciosEnRutina, crearRutinaSchema
  ejercicios.ts             # Ejercicio
  asistencias.ts            # Asistencia, registrarAsistenciaSchema
```

## Reglas

- **Tipos**: cada entidad exporta su tipo (con `z.infer`) y su esquema `zod`. Si una entidad no necesita campo nuevo, no se toca.
- **Fechas en JSON**: usar `z.coerce.date()` para campos de fecha, así los esquemas parsean strings ISO del API.
- **Campos opcionales**: usar `?.` anulable (`z.string().nullable()`) para columnas nullable de BD; `z.string().uuid()` para ids.
- **Schemas de entrada**: además del tipo de dominio, exponer esquemas de "creación" (`crearXSchema`) y autenticación que las apps usan en formularios (`loginSchema`, `crearRutinaSchema`, `registrarAsistenciaSchema`).
- **Export continua**: en `src/index.ts` con `export *`; no hacer barriletes manuales.
- **Build dual**: CJS a `dist/` (`tsconfig.json`) + ESM a `dist-esm/` (`tsconfig.esm.json`, con `dist-esm/package.json` tipo module). No romper ese contrato: Next y Astro consumen ESM/require según condición de `exports`.

## Flujo al cambiar shared

1. Editar tipos/schemas en `src/`.
2. `pnpm --filter @gimnasio/shared build`.
3. Recompilar las apps consumidoras (`pnpm --filter api build`, `pnpm --filter admin build`, `pnpm --filter web build`).

El CI (`api.yml`, `admin.yml`, `web.yml`) corre cuando cambian archivos de esta carpeta — no romper esos gates.