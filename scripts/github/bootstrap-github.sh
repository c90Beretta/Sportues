#!/usr/bin/env bash
# Crea las etiquetas y los issues del framework en GitHub y escribe los números #N en docs/roadmap.md.
# Requiere: GitHub CLI (`gh`) autenticado con permiso de escritura en el repo.
# Uso:   bash scripts/github/bootstrap-github.sh            (crea de verdad)
#        DRY_RUN=1 bash scripts/github/bootstrap-github.sh  (solo muestra qué haría)
# Es idempotente: si ya existe un issue con el mismo título, no lo duplica y reutiliza su número.
set -euo pipefail

REPO="${REPO:-c90Beretta/Sportues}"
DRY_RUN="${DRY_RUN:-0}"
cd "$(git rev-parse --show-toplevel)"
BACKLOG_DIR="scripts/github/backlog"
ROADMAP="docs/roadmap.md"

command -v gh >/dev/null 2>&1 || { echo "Falta GitHub CLI (gh): https://cli.github.com" >&2; exit 1; }
[ "$DRY_RUN" = "1" ] || gh auth status >/dev/null 2>&1 || { echo "Ejecuta 'gh auth login' primero." >&2; exit 1; }

run() { if [ "$DRY_RUN" = "1" ]; then echo "[dry-run] $*"; else "$@"; fi; }

echo "== Etiquetas =="
label() { run gh label create "$1" --color "$2" --description "$3" --repo "$REPO" --force; }
label feature       "0E8A16" "Nueva funcionalidad"
label task          "5319E7" "Trabajo técnico o de documentación"
label bug           "D73A4A" "Algo no funciona"
label escaped       "B60205" "Bug encontrado después del merge (lo usa metrics.mjs)"
label "in progress" "FBCA04" "Espejo de la columna In progress (lo usa metrics.mjs)"
for l in L0 L1 L2 L3 L4 L5 L6; do label "level:$l" "C5DEF5" "Nivel $l del Team Implementing Framework"; done

echo "== Issues =="
for f in "$BACKLOG_DIR"/*.md; do
  key="$(sed -n 's/^key: *//p' "$f" | head -1)"
  title="$(sed -n 's/^title: *//p' "$f" | head -1 | sed 's/^"//; s/"$//')"
  labels="$(sed -n 's/^labels: *//p' "$f" | head -1)"
  body="$(awk '/^---$/{c++; next} c>=2{print}' "$f")"

  existing=""
  if [ "$DRY_RUN" != "1" ]; then
    existing="$(gh issue list --repo "$REPO" --state all --limit 200 --json number,title \
      --jq ".[] | select(.title == \"$(printf '%s' "$title" | sed 's/"/\\"/g')\") | .number" | head -1)"
  fi

  if [ -n "$existing" ]; then
    num="$existing"; echo "  = ya existe #$num  $title"
  elif [ "$DRY_RUN" = "1" ]; then
    num="XX"; echo "  [dry-run] crearía: $title  [$labels]"
  else
    url="$(gh issue create --repo "$REPO" --title "$title" --label "$labels" --body "$body")"
    num="${url##*/}"; echo "  + #$num  $title"
  fi
  [ "$DRY_RUN" = "1" ] || perl -pi -e "s/\Q{{I:$key}}\E/#$num/g" "$ROADMAP"
done

echo
echo "Listo. Revisa 'git diff docs/roadmap.md', asigna un responsable a cada issue y crea el tablero."
echo "Recuerda: los issues se crean ANTES del código; no se crean retroactivamente."
