# Roadmap

Memoria del proyecto: qué está hecho y qué sigue. Cada checkbox enlaza a su issue. Cuando un PR termina un ítem, **marca el checkbox en el mismo PR**. Este archivo no se edita en bloque la noche del tag: las fechas del historial de Git se revisan.

Los números `#N` los escribe `scripts/github/bootstrap-github.sh` al crear los issues; si ves `{{I:...}}` el script aún no se ejecutó.

## Fase 0 — Kickoff (vie 13 nov) · L0

- [ ] Opinión inicial sobre IA e hipótesis del experimento, escritas sin IA (#19)

## Fase 1 — Checkpoint 1 (mié 18 nov, 23:59) · L1–L2

- [ ] Plantillas de issue feature / bug / task con criterios de aceptación (#25)
- [ ] Flujo: tablero, `docs/framework.md`, plantilla de PR con AI log (#18)
- [ ] `docs/roadmap.md` con fases hasta el Final (#24)
- [ ] Todo el trabajo restante de M3 escrito como issues con criterios (uno por línea en la sección "Trabajo de producto M3" de abajo)

## Fase 2 — Checkpoint 2 (mié 25 nov, 23:59) · L3–L5 + experimento

- [ ] CI con pruebas en ambos lados del stack y guardrail "sin checks silenciados / piso de pruebas" (#13)
- [ ] Bug: `web.yml` es YAML inválido, corregido con prueba de regresión (#12)
- [ ] Bug: secreto JWT por defecto en código, corregido con prueba de regresión (#11)
- [ ] Protección de la rama `main` (#21)
- [ ] Archivo de contexto con "How this team works" + prueba en sesión fresca (#14)
- [ ] Al menos 2 ADRs de decisiones reales (#8)
- [ ] Comandos reutilizables y rol revisor (#10)
- [ ] 2 issues de M3 llevados de issue a PR por un agente y corregidos por el equipo (#9)
- [ ] Experimento: tarea elegida, criterios y predicciones guardadas (#16)
- [ ] Experimento: Run A (`experiment/vibe`) y Run B (`experiment/engineered`) ejecutadas (#17)

## Fase 3 — Final evidence (lun 30 nov, 23:59) · L6

- [ ] `docs/metrics.md` con las cinco métricas calculadas con datos reales (#20)
- [ ] Retro (sin IA), una regla cambiada y L0 revisitado — en `docs/framework.md` (#23)
- [ ] `docs/experiment.md` completo con tabla comparativa (#17)
- [ ] `docs/research.md` con fuentes verificadas (#22)
- [ ] Tag `m3` creado después de mergear todo lo anterior

## Fase 4 — Showcase (jue 3 / vie 4 dic)

- [ ] Demo de 5 minutos: framework, resultado del experimento, tema de investigación (#15)

## Trabajo de producto M3

<!-- Una línea por issue de producto, con su checkbox, p. ej.:
- [ ] Título del issue (#N)
Cada issue debe existir ANTES de empezar el código. -->
