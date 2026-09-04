# API (NestJS + Prisma)

API REST del gimnasio. Expone autenticacion, CRUD de rutinas y ejercicios, y registro de asistencias.

## Stack

- NestJS 11 con TypeScript
- Prisma ORM sobre PostgreSQL 16
- Validacion de DTOs con `class-validator`
- Tipos de dominio reutilizados desde `@gimnasio/shared`

## Estructura

```
src/
  main.ts
  app.module.ts
  prisma/              → PrismaService / PrismaModule (global)
  modules/
    auth/              → login, guardas JWT y de roles
    usuarios/          → CRUD de estudiantes y staff
    rutinas/           → CRUD de rutinas (con ejercicios)
    ejercicios/        → CRUD de ejercicios
    asistencias/       → registro y listado de asistencias
prisma/
  schema.prisma        → modelo de datos
```

## Como empezar

```bash
npm install                           # desde la raiz del repositorio
npm run prisma:generate --workspace=api # genera el cliente de Prisma
npm run prisma:push --workspace=api    # sincroniza el schema con la BD (solo desarrollo)
npm run start:dev --workspace=api      # servidor en http://localhost:3000
```

La conexion usa `DATABASE_URL` de `.env` (postgres del servicio `db` del devcontainer).

## Endpoints principales

| Metodo  | Ruta               | Acceso            | Descripcion                          |
| ------- | ------------------ | ----------------- | ------------------------------------ |
| POST    | /auth/login        | publico           | Inicia sesion y devuelve un JWT      |
| POST    | /usuarios          | STAFF             | Crea un usuario                      |
| GET     | /usuarios          | STAFF             | Lista usuarios                       |
| GET     | /usuarios/:id      | STAFF / dueno     | Obtiene un usuario                   |
| GET     | /ejercicios        | autenticado       | Lista ejercicios                     |
| POST    | /ejercicios        | STAFF             | Crea un ejercicio                    |
| POST    | /rutinas           | STAFF             | Crea una rutina para un estudiante   |
| GET     | /rutinas           | STAFF             | Lista rutinas (filtro ?estudianteId) |
| GET     | /rutinas/mias      | ESTUDIANTE        | Rutinas del estudiante autenticado   |
| POST    | /asistencias       | autenticado       | Registra asistencia (check-in)       |
| GET     | /asistencias       | autenticado       | Lista asistencias (propias si alumno)|

## Tests

```bash
npm run test --workspace=api
```
