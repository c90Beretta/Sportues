# @gimnasio/shared

Paquete de TypeScript puro con los tipos de dominio y esquemas de validación (`zod`) compartidos por las tres apps.

## Contenido

- `Usuario`, `Membresia`, `Rutina`, `Ejercicio`, `Asistencia` (+ variantes de creación y login).
- Esquemas `zod` equivalentes para validar datos de entrada en los clientes.

## Uso

```ts
import type { Rutina, Usuario } from "@gimnasio/shared";
import { loginSchema, crearRutinaSchema } from "@gimnasio/shared";
```

Se compila a `dist/` (CommonJS). Los consumidores (NestJS, Next.js, Astro) resuelven el paquete desde el workspace; Next.js lo transpila vía `transpilePackages`.

## Build

```bash
npm run build --workspace=@gimnasio/shared
```
