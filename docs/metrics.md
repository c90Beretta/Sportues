# Métricas L6

Fecha de medición: 2026-11-21

Fuente: GitHub API de `c90Beretta/Sportues`. No se estimaron valores.

## Método

- **Cycle time:** mediana del tiempo desde la creación del PR hasta su merge.
- **PR size:** mediana de `additions + deletions` por PR mergeado.
- **Review rounds:** mediana del número de submissions de revisión por PR mergeado.
- **Escaped bugs:** cantidad de issues con la etiqueta `escaped`.
- **AI acceptance:** Sin datos. No existe evidencia verificable que clasifique sugerencias individuales de IA como aceptadas, rechazadas o modificadas.

## Resultados

| Métrica | Resultado | Evidencia |
|---|---:|---|
| Cycle time | 0.1 d (2.0 h) | 17 PRs mergeados consultados |
| PR size | 567.0 líneas | 17 PRs con tamaño disponible |
| Review rounds | 1.0 submissions | 17 PRs mergeados consultados |
| Escaped bugs | 0 | Sin issues con etiqueta `escaped` |
| AI acceptance | Sin datos | 6/17 PRs mergeados contienen una sección o término `AI log`; esto no demuestra aceptación |

## Cobertura de AI log

- PR #37: sin sección AI log observable
- PR #36: incluye AI log
- PR #34: incluye AI log
- PR #33: sin sección AI log observable
- PR #31: sin sección AI log observable
- PR #30: sin sección AI log observable
- PR #29: incluye AI log
- PR #28: incluye AI log
- PR #27: incluye AI log
- PR #26: incluye AI log
- PR #7: sin sección AI log observable
- PR #6: sin sección AI log observable
- PR #5: sin sección AI log observable
- PR #4: sin sección AI log observable
- PR #3: sin sección AI log observable
- PR #2: sin sección AI log observable
- PR #1: sin sección AI log observable

## Limitaciones

- No se infiere aceptación de IA sin un registro explícito de kept/changed/rejected.
- Las review rounds se aproximan con submissions GitHub verificables.
- El cycle time se mide desde creación del PR, no desde el inicio de un issue.
- Los resultados deben regenerarse antes de cerrar L6.
