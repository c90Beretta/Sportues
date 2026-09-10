# Despliegue en Dokploy

El proyecto se despliega desde `docker-compose.yml` como tres servicios: `api`, `admin` y `web`. PostgreSQL se crea aparte usando el tipo **Database** de Dokploy.

1. En Dokploy, crea un proyecto y un servicio tipo **Compose** apuntando a este repositorio.
2. Usa la rama que quieras desplegar y el archivo `docker-compose.yml` de la raíz.
3. Crea una base de datos **Postgres** en el mismo entorno de Dokploy. Copia su **Internal Connection URL** y úsala como `DATABASE_URL` del Compose. No expongas un puerto externo para la base de datos salvo que necesites conectarte desde fuera del servidor.

4. Define estas variables en el servicio Compose:

   - `DATABASE_URL`: URL interna entregada por la base de datos de Dokploy.
   - `JWT_SECRET`: secreto largo y aleatorio; debe mantenerse igual en `api`, `admin` y `web`.

5. Despliega y espera a que los healthchecks queden en verde.
6. Crea los dominios en Dokploy, uno por servicio:

   - `web` → puerto interno `4321` (público).
   - `admin` → puerto interno `3001` (público o restringido según necesidad).
   - `api` → puerto interno `3000` (normalmente solo accesible desde los frontends).

La base de datos queda gestionada por Dokploy, incluyendo su volumen y las opciones de backup. En el primer arranque, la API ejecuta `prisma db push` antes de iniciar NestJS, porque el repositorio todavía no tiene migraciones Prisma versionadas.
