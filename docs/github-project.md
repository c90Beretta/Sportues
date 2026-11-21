# Procedimiento para crear el GitHub Project

Estado actual: no existe ningún GitHub Project. La cuenta autenticada no tiene permiso para crear Projects bajo el owner `c90Beretta`.

## Permisos necesarios

Una persona con permisos de administrador sobre la organización/owner `c90Beretta` debe:

1. Crear el Project `Sportues — M3 Framework`.
2. Otorgar permisos de edición al equipo.
3. Vincular el Project al repositorio `c90Beretta/Sportues`.

## Comandos de referencia

```sh
gh project create --owner c90Beretta --title "Sportues — M3 Framework" --format json
gh project list --owner c90Beretta --format json
```

GitHub CLI no permite vincular un Project al repositorio mediante el comando `gh project link` de forma estable en esta versión. Cuando exista el Project, una persona administradora puede vincularlo desde la UI:

```text
Project → Settings → Linked repositories → c90Beretta/Sportues
```

## Campos

- `Status`: Backlog, Ready, In progress, In review, Done.
- `Responsible`: personas del equipo.
- `Priority`: baja, media, alta.
- Conservar las etiquetas existentes `feature`, `bug`, `task`, `in progress` y `level:*`.

## Incorporación de issues

Incorporar los issues M3 existentes sin crear tareas nuevas. La tarjeta conserva el estado GitHub real:

- issue abierto sin etiqueta `in progress` → Backlog o Ready según DoR;
- issue abierto con etiqueta `in progress` → In progress;
- issue cerrado por PR mergeado → Done;
- issue cerrado sin merge → no debe asumirse Done sin evidencia.

El issue #38 debe agregarse al Project como el candidato M3 de asistencia. No implementar ni mover a Done hasta que exista PR mergeado.
