# L4 — Prueba en sesión fresca

## Intento 1: Claude Code

- Fecha y hora: 2026-11-20T12:02:19-07:00
- Herramienta: Claude Code, sesión interactiva en terminal
- Versión: 2.1.329
- Directorio: `/home/josenoperi/Sportues`
- Resultado: bloqueado por saldo insuficiente (`Credit balance too low`).

Claude Code no llegó a ejecutar la pregunta ni a leer los archivos.

## Intento 2: Claude web

- Herramienta: Claude en navegador.
- Repositorio consultado: https://github.com/c90Beretta/Sportues
- Rama consultada: `main`.
- Tipo de revisión: sesión independiente del historial del proyecto.
- Resultado: revisión parcial.

### Pregunta

> What is the next task and how should I do it?

### Respuesta íntegra del agente

## Revisión L4 de Sportues: lo verificado y lo que no pude leer

No pude leer la mayor parte de los archivos solicitados. Por eso no puedo cerrar la revisión de los ADR ni responder la pregunta literal con datos reales.

### 1. Archivos consultados

**Archivos que sí pude leer en `main`:**
- `README.md`
- `CLAUDE.md`
- Lista de carpetas de la raíz del repositorio.

**Archivos que no pude leer:**
- `AGENTS.md`: GitHub devolvió un error de servidor en dos ocasiones.
- `docs/framework.md`
- `docs/roadmap.md`
- Los tres ADR.
- `docs/evidence/l4-fresh-session.md`

Los ADR y el archivo de evidencia estaban en la rama local y no tuve acceso a ellos.

### 2. Revisión técnica de los tres ADR

No puedo certificar el contenido completo de los ADR. Sin embargo, con base en `README.md` y `CLAUDE.md`, pude verificar lo siguiente:

| ADR | Información verificada | Aspectos que deben comprobarse |
|---|---|---|
| 0001 — Prisma y PostgreSQL | La API utiliza NestJS 11, Prisma y PostgreSQL 16. | `npm run setup:db` ejecuta `prisma db push`. El ADR no debería afirmar que existen migraciones versionadas si no las hay. |
| 0002 — JWT, cookies y sesiones independientes | Existen las cookies `admin_session` (STAFF) y `web_session` (ESTUDIANTE). La API firma los JWT y las aplicaciones los verifican. | `JWT_SECRET` es compartido por las tres aplicaciones. Las cookies y los tokens son independientes, no los secretos. |
| 0003 — Paquete shared con Zod | `@gimnasio/shared` contiene tipos y esquemas Zod, con compilación dual CJS/ESM. | La API utiliza `class-validator`, no Zod. |

### 3. Pregunta de la prueba

**Pregunta literal:**

> What is the next task and how should I do it?

No puedo responderla honestamente porque la siguiente tarea depende de `docs/roadmap.md`, archivo al que no pude acceder. Elegir una tarea sin leerlo sería inventar información.

Lo que sí pude identificar en `CLAUDE.md`:

- Leer el archivo completo antes de modificar código.
- Solicitar autorización antes de modificar archivos protegidos.
- No instalar dependencias sin permiso.
- En la API, añadir pruebas por cada servicio nuevo y ejecutar `npm run test --workspace=api`.
- En frontend, ejecutar el proceso de compilación de la aplicación antes de terminar.

### 4. Evaluación de los cinco criterios

| Criterio | Resultado |
|---|---|
| Identificar la siguiente tarea desde `docs/roadmap.md` | No evaluable: no pude consultar el roadmap. |
| Proponer una rama `feature/<n>-<nombre>` o `bugfix/<n>-<nombre>` | No evaluable: `CLAUDE.md` no define la convención. |
| Mencionar `Closes #<n>`, Conventional Commits, plantilla de PR y AI log | No evaluable: no pude verificar esas reglas. |
| Proponer pruebas primero y no debilitarlas | Cubierto parcialmente: se solicitan pruebas por servicio, pero no se especifica que deban escribirse primero ni que no deban debilitarse. |
| Consultar los ADR para cambios de arquitectura, autenticación o base de datos | No evaluable: no pude consultar los ADR. |

Esto no demuestra que las instrucciones estén ausentes. Podrían estar definidas en `AGENTS.md` o `docs/framework.md`.

### 5. Observaciones y correcciones recomendadas

1. **Vínculos de contexto:** `CLAUDE.md` en `main` no enlaza explícitamente el flujo de L4. Si `framework.md` define estas reglas, convendría enlazarlo junto con `docs/adr/`. Sin embargo, `CLAUDE.md` es un archivo protegido y cualquier cambio requiere aprobación humana explícita.
2. **Alternativas consideradas:** deben reflejar lo que realmente ocurrió. Si el equipo aceptó las tecnologías propuestas por un compañero con experiencia, debe quedar explicado que no hubo una comparación formal. No deben inventarse alternativas que nunca se discutieron.
3. **Divulgación de IA:** cada ADR debería indicar que fue redactado con asistencia de IA y revisado por el equipo, de acuerdo con las reglas del proyecto.
4. **Datos por confirmar:** el equipo debe verificar quién propuso cada decisión, las fechas, el estado y si existieron desacuerdos. También deben buscarse marcadores como `COMPLETAR POR EL EQUIPO` y `TBD`.
5. **Coherencia del idioma:** los ADR deben respetar la convención lingüística del repositorio.
6. **Disponibilidad de los ADR:** los ADR solo estaban en la rama local y no podían consultarse desde `main`.

### 6. Entregables pendientes

- Terminar y revisar los tres ADR.
- Confirmar que no queden marcadores pendientes.
- Resolver posibles problemas de contexto, respetando la protección de archivos.
- Ejecutar una prueba real de sesión fresca con Claude Code cuando exista acceso funcional.
- Guardar la respuesta íntegra, fecha, modelo y hash del commit.
- Registrar cualquier fallo sin modificar la transcripción original.
- Preparar el commit y el PR siguiendo las convenciones del proyecto.

### 7. Conclusión

**No puede declararse L4 completo con la información disponible.**

Lo que sí se confirmó es que `README.md` y `CLAUDE.md` respaldan algunos aspectos técnicos de las decisiones documentadas en los ADR.

No se pudo certificar:
- La revisión completa de los ADR.
- El cumplimiento de los cinco criterios.
- La identificación de la siguiente tarea del roadmap.
- La evidencia de una sesión fresca real de Claude Code.

La revisión realizada desde el navegador constituye una evaluación parcial y no sustituye una ejecución de Claude Code.

No se modificaron archivos del repositorio ni se realizaron commits durante esta revisión.

**Fuentes:**
- https://github.com/c90Beretta/Sportues
- https://github.com/c90Beretta/Sportues/blob/main/CLAUDE.md

## Comprobación de criterios

- [ ] Identificó la siguiente tarea leyendo `docs/roadmap.md`.
- [ ] Propuso la rama con formato `feature/<n>-<nombre>` / `bugfix/<n>-<nombre>`.
- [ ] Mencionó `Closes #<n>`, Conventional Commits y plantilla de PR con AI log.
- [ ] Propuso escribir la prueba primero y no debilitar pruebas.
- [ ] Leyó `docs/adr/` si la tarea toca auth, arquitectura o base de datos.

## Resultado y limitaciones

La revisión de Claude web fue parcial: pudo leer `README.md` y `CLAUDE.md` en `main`, pero no pudo consultar `AGENTS.md`, `docs/framework.md`, `docs/roadmap.md` ni los ADR de la rama local.

Claude web indicó que no podía identificar la siguiente tarea sin consultar el roadmap y que no podía certificar el contenido de los ADR.

La ejecución de Claude Code quedó bloqueada por falta de créditos. Por lo tanto, no se considera superada la prueba de sesión fresca de Claude Code ni se marcan los criterios como aprobados.

Esta evidencia registra los resultados reales de ambos intentos, sin presentar la revisión web como una ejecución de Claude Code.
