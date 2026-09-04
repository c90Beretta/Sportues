# AGENTS.md — apps/api (NestJS + Prisma)

API REST del gimnasio. La fuente de verdad global es `AGENTS.md` (raíz); aquí van las reglas específicas de esta app.

## Comandos

```fish
npm run start:dev --workspace=api       # dev con watch en http://localhost:3000
npm run build --workspace=api           # prisma generate + nest build
npm run test --workspace=api            # jest
npm run prisma:generate --workspace=api
npm run prisma:push --workspace=api     # sincroniza schema con la BD (sin migraciones)
```

## Estructura obligatoria

```
src/
  main.ts                        # ValidationPipe global (whitelist + transform)
  app.module.ts                  # ConfigModule global + guards JWT/Roles vía APP_GUARD
  prisma/prisma.service.ts       # PrismaService (global)
  modules/
    <entidad>/
      <entidad>.module.ts
      <entidad>.controller.ts
      <entidad>.service.ts
      dto/*.dto.ts
```

No usar una estructura plana de controllers/services sueltos: **siempre un módulo por entidad**.

## Reglas

- **DTOs**: validar con `class-validator` (mensajes en español). El `ValidationPipe` global hace `whitelist` + `transform` + `forbidNonWhitelisted`.
- **Tipos**: las respuestas se tipan reutilizando `@gimnasio/shared` con `import type`. Nunca definir tipos de dominio a mano en esta app.
- **Authn/Authz**: los guards globales `JwtAuthGuard` + `RolesGuard` protegen todo por defecto. Usar:
  - `@Public()` en el controller/auth para rutas públicas (ej. `POST /auth/login`).
  - `@Roles("STAFF")` / `@Roles("ESTUDIANTE")` para restringir por rol (constantes `ROL_STAFF`/`ROL_ESTUDIANTE` en `modules/auth/interfaces/usuario-auth.interface.ts`).
  - El usuario autenticado llega como `req.user = { sub, id, email, rol }`.
- **Seguridad**: nunca exponer `passwordHash` en respuestas. `bcryptjs` para hash; JWT firmados con `JWT_SECRET` (expira en 8h).
- **Prisma**: relaciones y `include`/`select` para devolver datos anidados (ej. rutina → estudiante + ejercicios). El prefijo de rutas es raíz (sin `/api`).

## Tests

- Un spec por service (`*.spec.ts`) mockeando `PrismaService`. Ejemplo real: `src/modules/ejercicios/ejercicios.service.spec.ts`.
- Correr `npm run test --workspace=api`.

## Endpoints actuales

| Método | Ruta              | Rol             |
| ------ | ----------------- | --------------- |
| POST   | /auth/login       | público         |
| GET/POST | /usuarios       | STAFF (GET propia también estudiante) |
| GET/POST/PATCH/DELETE | /ejercicios | GET autenticado; mutaciones STAFF |
| POST   | /rutinas          | STAFF           |
| GET    | /rutinas          | STAFF           |
| GET    | /rutinas/mias     | ESTUDIANTE      |
| POST/GET | /asistencias    | autenticado (estudiante ve/registra las propias) |
