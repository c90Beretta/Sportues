---
description: Implementa un issue, prepara un PR y nunca hace merge
allowed-tools: Read, Grep, Glob, Edit, AskUserQuestion, Bash(git status:*), Bash(git diff:*), Bash(gh issue view:*), Bash(npm run test:frontend:*), Bash(npm run test --workspace=api:*), Bash(npm run build:*)
argument-hint: <numero-de-issue>
---

# Implementar issue

Usa GitHub Copilot CLI como agente de implementación. No afirmes que Claude Code ejecutó el trabajo.

## Entrada

El número del issue es `$ARGUMENTS`. Si falta, detente y pide el número.

## Fase 1: planificación obligatoria

1. Lee `AGENTS.md`, `CLAUDE.md`, `docs/framework.md`, `docs/roadmap.md` y las instrucciones aplicables de las subcarpetas.
2. Ejecuta `gh issue view $ARGUMENTS --repo c90Beretta/Sportues`.
3. Comprueba la Definition of Ready: criterios Given/When/Then, responsable asignado, ausencia de bloqueos y tamaño manejable.
4. Inspecciona el repositorio y crea un plan concreto que incluya:
   - objetivo y alcance;
   - archivos exactos que podrían cambiar;
   - comportamiento y archivos protegidos que no se tocarán;
   - criterios de aceptación traducidos en verificaciones observables;
   - ramas, commits, pruebas y formato de PR;
   - riesgos, bloqueos y dependencias.
5. Presenta el plan al usuario y termina la ejecución con una petición explícita de aprobación.

**PUERTA HUMANA OBLIGATORIA:** no uses `Edit`, `Write`, ni herramientas de escritura/git/GitHub hasta presentar el plan y recibir una aprobación humana explícita que nombre el plan aprobado. Una aprobación genérica, implícita o automática no es suficiente. Si no hay una respuesta explícita, detente aquí.

## Fase 2: implementación solo después de aprobar

Después de que una persona aprueba explícitamente el plan presentado:

1. Trabaja únicamente en la rama ya aprobada o indicada por el usuario. No uses `git switch`, `git checkout`, `git branch`, `git merge`, `git rebase`, `git reset` ni cualquier otro comando de rama o escritura histórica.
2. Implementa únicamente el alcance aprobado.
3. Sigue el patrón de pruebas primero para bugs y añade pruebas acordes a cada cambio.
4. Respeta los archivos protegidos: no cambies `package.json`, `package-lock.json`, `.devcontainer/`, `.github/workflows/`, `tsconfig*.json`, `astro.config.mjs`, `next.config.mjs`, `prisma/schema.prisma`, `.env*`, `AGENTS.md`, `CLAUDE.md` o `.claude/` sin autorización específica posterior.
5. No instales paquetes ni dependencias sin autorización explícita.
6. Ejecuta los gates relevantes y registra resultados reales.

## Fase 3: entrega

Usa `.github/pull_request_template.md` y comienza el cuerpo con `Closes #$ARGUMENTS`.

Incluye:

- cambios realizados;
- criterios verificados;
- comandos ejecutados y resultados;
- actualización de `docs/roadmap.md` solo si el PR termina un entregable que allí tenga checkbox;
- AI log con herramienta Copilot CLI, modo agente, prompt, errores, cambios y `Outcome`.

No crees un commit, una rama nueva, un PR ni hagas push. La entrega termina con el diff local y el resultado de las verificaciones.

## Límites absolutos

- Nunca fusiones el PR.
- Nunca apruebes el PR.
- Nunca hagas commit ni push.
- Nunca crees una rama o un PR.
- Nunca cierres el issue.
- Nunca modifiques reglas de protección de ramas.
- Nunca uses force-push.
- Nunca borres, saltes, debilites o silencies pruebas.
- Nunca incluyas secretos o tokens.
