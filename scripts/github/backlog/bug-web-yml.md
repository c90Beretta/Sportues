---
key: bug-web-yml
title: "fix(ci): web.yml tiene YAML inválido y el workflow no corre"
labels: bug,level:L3
---
**Severity:** medium

**Steps to reproduce**
1. Abrir `.github/workflows/web.yml` y mirar la línea 28 (`            - name: Install`, con 12 espacios en lugar de 6).
2. Parsear el archivo con un parser YAML (por ejemplo `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/web.yml'))"`).

**Expected**
El archivo es YAML válido y el workflow `web` compila la app Astro en los PRs que tocan `apps/web/**` o `packages/shared/**`.

**Actual**
El parser falla con `mapping values are not allowed here` en la línea 28, columna 19. Un workflow con YAML inválido no se puede ejecutar. (El workflow `CI` sí compila web en cada PR, por eso la severidad es media y no alta.)

**Evidence** (screenshot, error message, network log, failing test)
- Error del parser, reproducido el 2026-11-19 sobre el commit `7806f65`: `mapping values are not allowed here  in ".github/workflows/web.yml", line 28, column 19`.
- Pendiente de adjuntar por quien tome el issue: captura de la pestaña *Actions* mostrando el workflow `web` con error.

**Done when**
- [ ] Regression test added that fails before the fix (`tests/guardrails/workflows.test.ts`: todos los workflows deben parsear)
- [ ] Fix merged, CI green
