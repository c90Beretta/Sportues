# Configuración de GitHub para PRs

GitHub se conserva para alojar el repositorio y revisar/mergear PRs. La administración de tareas es local y no requiere configurar GitHub Issues ni GitHub Projects. Estas opciones de protección de rama se configuran en GitHub y no pueden imponerse desde archivos versionados.

## Reglas de `main`

En **Settings → Branches** crea una rule o ruleset para `main` con:

1. Requerir pull request antes de merge.
2. Requerir una aprobación.
3. Descartar aprobaciones obsoletas al recibir nuevos commits.
4. Requerir que pase el check **CI / Verificar monorepo**.
5. Bloquear force pushes y eliminaciones.
6. Incluir administradores en la regla.

## Integrantes y sesiones

1. Consulta la propuesta versionada en `docs/project-proposal.md`.
2. Clona el repositorio con el acceso normal al repositorio Git.
3. Registra la sesión real en `docs/pair-log.md` y alternen Driver/Navigator.
4. Registra y asigna las tareas en `.tasks/issues/`; consulta `.tasks/README.md`.

## Backlog de tareas

No crees ni mantengas un GitHub Project para el backlog. El equivalente local versionado se encuentra en `.tasks/`, con estados y transiciones validados por el CLI:

```bash
node scripts/tasks/issues.mjs list
node scripts/tasks/issues.mjs check
```

El script histórico `scripts/github/bootstrap-github.sh` está retirado y falla de forma explícita sin llamar a GitHub.
