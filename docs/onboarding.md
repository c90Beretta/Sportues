# Onboarding de Sportues

Guía para clonar, preparar, ejecutar y verificar el monorepo. La ruta recomendada es el Dev Container; no requiere instalar Node.js en el equipo anfitrión.

## Requisitos

- Git.
- Visual Studio Code.
- Docker con Docker Compose.
- La extensión **Dev Containers** de VS Code.
- Conexión a Internet para clonar el repositorio y descargar dependencias e imágenes.
- Para usar agentes personalizados: acceso elegible a GitHub Copilot y sesión iniciada en VS Code. Copilot no es necesario para ejecutar el proyecto.

El Dev Container y CI utilizan Node.js 24. La instalación del monorepo usa npm y el lockfile `package-lock.json`; no se fija una versión exacta de npm. Aunque el repositorio también contiene `pnpm-lock.yaml`, los scripts de preparación y CI usan npm.

## Clonar y abrir el Dev Container

1. Clona `c90Beretta/Sportues` y abre la carpeta raíz del repositorio en VS Code:

   ```bash
   git clone https://github.com/c90Beretta/Sportues.git
   cd Sportues
   ```
2. Instala la extensión **Dev Containers** si VS Code lo solicita.
3. Abre la paleta de comandos y ejecuta **Dev Containers: Reopen in Container**.
4. Espera a que termine el setup. `.devcontainer/setup.sh` ejecuta:

   ```bash
   npm ci --prefer-offline --no-audit --no-fund
   npm run build --workspace=@gimnasio/shared
   npm run prisma:generate --workspace=api
   ```

   El setup copia `apps/api/.env.example` a `apps/api/.env` solo cuando ese archivo todavía no existe. No copia automáticamente los ejemplos de Admin ni Web.

Comprueba el runtime del contenedor con:

```bash
node --version
npm --version
```

El contenedor incluye PostgreSQL 16 y el servicio `db`. Los puertos de API, Admin y Web se reenvían a `localhost`.

## Variables de entorno

Los ejemplos versionados son:

- API: `apps/api/.env.example`: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `RESEND_API_KEY`.
- Admin: `apps/admin/.env.example`: `API_URL`, `JWT_SECRET`.
- Web: `apps/web/.env.example`: `API_URL`, `JWT_SECRET`, `PORT`.

En el Dev Container, Docker Compose proporciona `DATABASE_URL`, `JWT_SECRET` y `PORT` al contenedor de trabajo. Admin y Web usan `API_URL` con el valor local predeterminado del código cuando no está definido. La API debe usar el mismo `JWT_SECRET` que Admin y Web para poder validar las sesiones.

Los ejemplos y Compose contienen configuración de desarrollo conocida. Úsala solo en un entorno local desechable; nunca la reutilices en producción ni para datos sensibles.

### Ejecutar las aplicaciones desde el host

La opción recomendada es ejecutar las tres aplicaciones dentro del Dev Container. Para ejecutarlas directamente en el host:

1. Instala Node.js 24 y usa npm desde la raíz.
2. Asegúrate de tener PostgreSQL accesible desde el host.
3. Si no existen ya los `.env` de destino, copia manualmente los ejemplos que necesites. No sobrescribas archivos `.env` existentes:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/admin/.env.example apps/admin/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. En `apps/api/.env`, configura `DATABASE_URL` para una base accesible desde el host. El nombre `db` del ejemplo corresponde a la red Docker y no resuelve directamente desde el host.
5. Configura el mismo `JWT_SECRET` en las tres aplicaciones y usa `API_URL` para apuntar a la API local.

El Compose de desarrollo no publica el puerto de PostgreSQL al host. Por tanto, para este modo se necesita una base PostgreSQL accesible por separado; no basta con cambiar la dirección del ejemplo.

No subas archivos `.env` ni incluyas sus valores en issues, PRs o capturas.

## Preparar PostgreSQL y Prisma

Desde la raíz, después de que PostgreSQL esté listo:

```bash
npm run setup:db
```

Este comando ejecuta `prisma db push` en la API y sincroniza el esquema con la base configurada en `DATABASE_URL`. El setup del Dev Container genera Prisma Client; el build y los tests de API también ejecutan `prisma generate`.

El repositorio incluye los scripts `prisma:migrate` y `prisma:deploy`, además de una migración versionada. El flujo de desarrollo documentado aquí usa `setup:db`; la estrategia de migraciones para despliegue no está descrita consistentemente en toda la documentación, así que no cambies de estrategia al desplegar sin confirmación del equipo.

Para abrir Prisma Studio:

```bash
npm run prisma:studio
```

## Iniciar las aplicaciones

Para iniciar API, Admin y Web a la vez:

```bash
npm run dev
```

O inicia cada aplicación por separado desde la raíz:

```bash
npm run start:dev --workspace=api
npm run dev --workspace=admin
npm run dev --workspace=web
```

| Aplicación | URL local |
|---|---|
| API | http://localhost:3000 |
| Admin | http://localhost:3001 |
| Web | http://localhost:4321 |

Admin y Web requieren que la API esté disponible. Sus sesiones son independientes: Admin utiliza `admin_session` y Web utiliza `web_session`.

## Seed de administrador y correo

El seed se ejecuta con:

```bash
npm run seed:admin
```

El proceso también necesita `DATABASE_URL` para conectarse. El script lee `ADMIN_NOMBRE`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` del entorno del proceso. Si no se proporcionan, usa valores predeterminados de desarrollo; configura credenciales propias antes de ejecutarlo y no uses esos valores predeterminados fuera de una base local desechable. No asumas que el script carga automáticamente `apps/api/.env`.

La API usa Resend para ciertos flujos de correo. `RESEND_API_KEY` está en el ejemplo de API y vacío; para probar envíos reales se necesita una clave válida de Resend. Los flujos que no envían correo no requieren configurar ese servicio.

## Pruebas y builds

Comandos de validación disponibles en el monorepo:

```bash
npm run test:frontend
npm run test --workspace=api
npm run build
```

`test:frontend` ejecuta Vitest; el test de API genera Prisma Client y ejecuta Jest. `build` construye `@gimnasio/shared` y las tres aplicaciones.

También se puede compilar o comprobar una aplicación por separado:

```bash
npm run build --workspace=api
npm run build --workspace=admin
npm run build --workspace=web
npm run astro --workspace=web -- check
```

## Desarrollo y producción

El Dev Container, sus credenciales y los ejemplos `.env.example` son exclusivamente para desarrollo local. En producción:

- Proporciona `DATABASE_URL`, `JWT_SECRET` y, cuando se envíen correos, `RESEND_API_KEY` mediante la gestión de secretos del entorno de despliegue; no uses los valores de ejemplo.
- Usa un `JWT_SECRET` aleatorio y privado, con el mismo valor en API, Admin y Web.
- No despliegues con las credenciales de desarrollo del Compose ni con los valores predeterminados del seed.
- Confirma con el equipo el procedimiento de esquema/migraciones antes de desplegar; `npm run setup:db` usa `prisma db push` y no sustituye una política de migración acordada.

Esta guía no configura ni modifica servicios de despliegue.

## Solución de problemas

- **El contenedor no inicia:** comprueba que Docker esté activo y que VS Code tenga instalada la extensión Dev Containers.
- **No resuelve `db`:** ese hostname funciona en la red Docker. Desde el host, configura `DATABASE_URL` con una base accesible desde el host.
- **La API no conecta a PostgreSQL:** espera a que el servicio esté saludable y revisa `DATABASE_URL`; luego vuelve a ejecutar `npm run setup:db`.
- **Error de JWT o sesión inválida:** verifica que API, Admin y Web tengan el mismo `JWT_SECRET` y que no estés mezclando las cookies de sus sesiones.
- **Admin o Web no llegan a la API:** confirma que la API esté ejecutándose y que `API_URL` apunte al servicio correcto.
- **Falla un envío de correo:** configura `RESEND_API_KEY` con una clave válida; no la compartas ni la subas al repositorio.
- **Falla la instalación:** abre una terminal en la raíz y vuelve a ejecutar `npm ci`. No ejecutes `pnpm install` para este flujo.

## GitHub Copilot Chat y agentes del repositorio

El proyecto contiene agentes personalizados para Copilot en `.github/agents/`. Las instrucciones y límites completos están en [`.github/copilot-instructions.md`](../.github/copilot-instructions.md), [`implementador-issue`](../.github/agents/implementador-issue.agent.md) y [`revisor-pr`](../.github/agents/revisor-pr.agent.md).

### Habilitar Copilot Chat

1. Instala o habilita GitHub Copilot y GitHub Copilot Chat en VS Code si no están disponibles en tu instalación.
2. Abre el menú de Copilot en la barra de estado o ejecuta **GitHub Copilot: Sign in** desde la paleta de comandos.
3. Inicia sesión con una cuenta que tenga acceso elegible a Copilot y acepta las políticas aplicables del equipo o institución.
4. Abre Copilot Chat, cambia el modo a **Agent** y abre el selector de agentes.
5. Con el repositorio abierto como workspace, selecciona `implementador-issue` o `revisor-pr`. Los agentes se descubren desde sus archivos `.agent.md` en `.github/agents/`.

Si un agente no aparece, confirma que abriste la raíz correcta del repositorio, que los archivos del agente no muestran errores y vuelve a cargar la ventana de VS Code. No todos los entornos exponen las mismas herramientas de GitHub: si el revisor no dispone de acceso de lectura al PR, proporciona el enlace y el diff, el issue relacionado y la evidencia de CI como contexto.

### Elegir el agente adecuado

**Implementación**: selecciona `implementador-issue` y usa, por ejemplo:

> Inspecciona el issue #N, verifica sus criterios y propón un plan con archivos, pruebas y riesgos. No edites hasta que apruebe explícitamente el plan.

El agente debe leer el issue, presentar el plan y detenerse. Solo puede editar después de que una persona apruebe ese plan explícitamente. Esa aprobación del plan no autoriza a modificar archivos protegidos ni a instalar dependencias: para esas acciones se requiere autorización específica adicional.

**Revisión**: selecciona `revisor-pr` y usa, por ejemplo:

> Revisa el PR #N contra su issue, los criterios de aceptación, el template y CI. Devuelve hallazgos accionables y aspectos correctos; no publiques comentarios ni apruebes el PR.

La revisión es consultiva: el agente no debe editar, publicar comentarios o reviews, aprobar, solicitar cambios formalmente, cerrar ni fusionar. Una persona distinta del autor debe realizar la revisión y cualquier acción en GitHub.

Los límites anteriores son instrucciones de trabajo, no una barrera de seguridad. `.github/agent-permissions.json` describe guardrails, pero ni ese archivo ni el prompt aíslan el proceso o garantizan que un agente o una herramienta no pueda ejecutar otra operación. Revisa las herramientas disponibles, los cambios y sus resultados antes de aceptar cualquier salida.

### Qué funciona sin Copilot

Copilot no es necesario para clonar, instalar, configurar PostgreSQL, iniciar API/Admin/Web, ejecutar Prisma, tests o builds, ni revisar el código manualmente. Solo requiere Copilot quien quiera usar Chat o los agentes personalizados. La cuenta, disponibilidad de modelos, cuotas, extensiones y herramientas GitHub dependen del proveedor y del entorno de cada persona.

## Documentación adicional

- [README raíz](../README.md) y [README de API](../apps/api/README.md), [Admin](../apps/admin/README.md) y [Web](../apps/web/README.md).
- [Arquitectura](./arquitectura.md) y [framework de trabajo](./framework.md).
- [Configuración de GitHub](./github-setup.md).
