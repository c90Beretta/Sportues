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

## Project board

En **Projects**, crea un tablero del repositorio llamado `Sportues — M1` con estas columnas:

- Todo
- In progress
- In review
- Done

Vincula los issues y pull requests al tablero.

## Proposal e integrantes

1. Crea un issue usando el template **Project Proposal** y pega el contenido de `docs/project-proposal.md`.
2. Confirma que ambos integrantes tienen acceso de escritura y clonan por SSH.
3. Crea una rama por cambio, abre un pull request y solicita revisión del compañero.
4. Registra la sesión real en `docs/pair-log.md` y alternen Driver/Navigator.
