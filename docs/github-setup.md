# Configuración de GitHub para Week 1

Estas opciones se configuran en GitHub y no pueden imponerse desde archivos versionados.

## Reglas de `main`

En **Settings → Branches** crea una rule o ruleset para `main` con:

1. Requerir pull request antes de merge.
2. Requerir una aprobación.
3. Descartar aprobaciones obsoletas al recibir nuevos commits.
4. Requerir que pase el check **CI / Verificar monorepo**.
5. Bloquear force pushes y eliminaciones.
6. Incluir administradores en la regla.

## Proposal e integrantes

1. Crea un issue usando el template **Project Proposal** y pega el contenido de `docs/project-proposal.md`.
2. Confirma que ambos integrantes tienen acceso de escritura y clonan por SSH.
3. Crea una rama por cambio, abre un pull request y solicita revisión del compañero.
4. Registra la sesión real en `docs/pair-log.md` y alternen Driver/Navigator.

## Project board del framework (Sportues — M3)

Crea (o renombra) el tablero del repositorio con **exactamente** estos estados, en este orden. El campo `Status` del proyecto se edita en la UI (Project → ⋯ → Settings → Status):

1. Backlog
2. Ready
3. In progress
4. In review
5. Done

Automatizaciones recomendadas (Project → Workflows): *Item added to project → Backlog*, *Pull request merged → Done*, *Item closed → Done*.

Reglas de uso (están en `docs/framework.md`):
- No muevas todo el tablero de golpe: cada tarjeta se mueve cuando el trabajo cambia de estado de verdad.
- Al pasar a **In progress**, añade la etiqueta `in progress` al issue.
- WIP máximo por persona: el definido en `docs/framework.md`.

## Orden recomendado para L1–L2

1. Ejecuta `scripts/github/bootstrap-github.sh` (crea etiquetas e issues del framework).
2. Crea el tablero y vincula los issues.
3. Recién entonces abre ramas y PRs con `Closes #N`.
