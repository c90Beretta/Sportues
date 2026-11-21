#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";

const REPO = "c90Beretta/Sportues";

function ghJson(...args) {
  return JSON.parse(
    execFileSync("gh", args, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    }),
  );
}

function mediana(valores) {
  if (valores.length === 0) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  const medio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0
    ? (ordenados[medio - 1] + ordenados[medio]) / 2
    : ordenados[medio];
}

function formatoCiclo(horas) {
  if (horas === null) return "Sin datos";
  return `${(horas / 24).toFixed(1)} d (${horas.toFixed(1)} h)`;
}

function formatoMediana(valor) {
  return valor === null ? "Sin datos" : valor.toFixed(1);
}

const prsCerrados = ghJson(
  "api",
  `repos/${REPO}/pulls?state=closed&per_page=100`,
);

const prsMergeados = prsCerrados.filter((pr) => pr.merged_at);
const detalles = prsMergeados.map((pr) =>
  ghJson("api", `repos/${REPO}/pulls/${pr.number}`),
);

const ciclos = detalles
  .filter((pr) => pr.created_at && pr.merged_at)
  .map((pr) =>
    (new Date(pr.merged_at).getTime() - new Date(pr.created_at).getTime()) /
    3600000,
  );

const tamanos = detalles
  .filter((pr) => Number.isFinite(pr.additions) && Number.isFinite(pr.deletions))
  .map((pr) => pr.additions + pr.deletions);

const rondas = [];
for (const pr of detalles) {
  const reviews = ghJson(
    "api",
    `repos/${REPO}/pulls/${pr.number}/reviews?per_page=100`,
  );
  rondas.push(reviews.length);
}

const archivosIssue = [
  ...readdirSync(".tasks/issues").map((nombre) => `.tasks/issues/${nombre}`),
  ...readdirSync(".tasks/archive/closed").map((nombre) => `.tasks/archive/closed/${nombre}`),
].filter((ruta) => ruta.endsWith(".md"));
const issuesLocales = archivosIssue.map((ruta) => {
  const contenido = readFileSync(ruta, "utf8");
  const frontmatter = contenido.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) throw new Error(`${ruta}: falta YAML Frontmatter`);
  return parse(frontmatter);
});
const escaped = issuesLocales.filter((issue) =>
  issue.type === "bug" && issue.labels?.includes("escaped"),
);

const aiLogged = detalles.filter((pr) =>
  /\bAI log\b/i.test(pr.body ?? ""),
);

const markdown = `# Métricas L6

Fecha de medición: ${new Date().toISOString().slice(0, 10)}

Fuente: GitHub API para métricas de PR; Issues \`escaped\` desde \`.tasks/\`. No se estimaron valores.

## Método

- **Cycle time:** mediana del tiempo desde la creación del PR hasta su merge.
- **PR size:** mediana de \`additions + deletions\` por PR mergeado.
- **Review rounds:** mediana del número de submissions de revisión por PR mergeado.
- **Escaped bugs:** cantidad de issues con la etiqueta \`escaped\`.
- **AI acceptance:** Sin datos. No existe evidencia verificable que clasifique sugerencias individuales de IA como aceptadas, rechazadas o modificadas.

## Resultados

| Métrica | Resultado | Evidencia |
|---|---:|---|
| Cycle time | ${formatoCiclo(mediana(ciclos))} | ${detalles.length} PRs mergeados consultados |
| PR size | ${formatoMediana(mediana(tamanos))} líneas | ${tamanos.length} PRs con tamaño disponible |
| Review rounds | ${formatoMediana(mediana(rondas))} submissions | ${rondas.length} PRs mergeados consultados |
| Escaped bugs | ${escaped.length} | ${escaped.length === 0 ? "Sin issues con etiqueta `escaped`" : "Etiquetas `escaped` encontradas"} |
| AI acceptance | Sin datos | ${aiLogged.length}/${detalles.length} PRs mergeados contienen una sección o término \`AI log\`; esto no demuestra aceptación |

## Cobertura de AI log

${detalles
  .map((pr) =>
    `- PR #${pr.number}: ${
      /\bAI log\b/i.test(pr.body ?? "")
        ? "incluye AI log"
        : "sin sección AI log observable"
    }`,
  )
  .join("\n")}

## Limitaciones

- No se infiere aceptación de IA sin un registro explícito de kept/changed/rejected.
- Las review rounds se aproximan con submissions GitHub verificables.
- El cycle time se mide desde creación del PR, no desde el inicio de un issue.
- Los resultados deben regenerarse antes de cerrar L6.
`;

writeFileSync("docs/metrics.md", markdown);
