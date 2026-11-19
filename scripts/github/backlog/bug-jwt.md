---
key: bug-jwt
title: "fix(auth): secreto JWT por defecto escrito en el código"
labels: bug,level:L3
---
**Severity:** high

**Steps to reproduce**
1. Buscar el valor por defecto: `grep -rn "dev-secret" apps --include=*.ts` (revisado sobre el commit `7806f65`).
2. Arrancar la API (o admin/web) **sin** definir `JWT_SECRET`.
3. Iniciar sesión: el token se firma con `"dev-secret"`; el guard de la API y `getSession` de admin/web aceptan tokens firmados con ese valor público.

**Expected**
Si `JWT_SECRET` no está definido o está vacío, la aplicación se niega a firmar o verificar tokens y lanza un error explícito. Nunca se usa un secreto por defecto escrito en el código.

**Actual**
Hay secretos por defecto en cinco sitios, y cualquiera que lea el repositorio los conoce:
- `apps/api/src/modules/auth/auth.service.ts:25` → `?? "dev-secret"`
- `apps/api/src/modules/auth/guards/jwt-auth.guard.ts:39` → `?? "dev-secret"`
- `apps/api/src/modules/registro/registro.service.ts:132` → `?? "dev-secret"`
- `apps/admin/lib/config.ts:2` y `apps/web/src/lib/config.ts:2` → `?? "dev-secret-cambiar-en-produccion"`

Un despliegue al que se le olvide `JWT_SECRET` queda con autenticación falsificable (incluido rol `STAFF`).

**Evidence** (screenshot, error message, network log, failing test)
- Referencias archivo:línea de arriba (lectura estática del código; no se ejecutó la API para este reporte).
- Pendiente: prueba que falle hoy (la define el PR de regresión).

**Done when**
- [ ] Regression test added that fails before the fix
- [ ] Fix merged, CI green
