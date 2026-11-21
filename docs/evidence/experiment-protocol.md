# Protocolo reproducible del experimento A/B

Este documento prepara el experimento. No ejecuta Run A ni Run B.

## Congelación previa

Antes de Run A, el equipo debe registrar:

- issue de producto mediano;
- commit base;
- petición exacta de una sola línea;
- modelo usado en ambas runs;
- agente usado en ambas runs;
- versión exacta de GitHub Copilot CLI;
- fecha/hora;
- criterios de aceptación;
- tres predicciones individuales sin IA.

## Ejecución

```sh
git fetch origin main
git switch main
git pull --ff-only origin main
git switch -c experiment/vibe
```

Run A:

```text
Implementa el issue <N> y verifica sus criterios de aceptación.
```

Guardar la transcripción íntegra en `docs/evidence/experiment/vibe.md`.

```sh
git switch main
git switch -c experiment/engineered
```

Run B usa la misma petición, modelo, agente y commit base. Guardar la transcripción íntegra en `docs/evidence/experiment/engineered.md`.

## Medición

No corregir Run A ni añadir pruebas manuales después de ejecutarlo.

Registrar solo resultados observables:

- compilación;
- tests existentes;
- tests nuevos;
- criterios Given/When/Then;
- archivos cambiados;
- tiempo real;
- ciclos de rework;
- errores de compilación;
- revisión humana;
- merge viable.

Completar `docs/experiment.md` con nueve criterios. No inventar datos.
