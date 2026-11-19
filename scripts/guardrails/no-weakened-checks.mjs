#!/usr/bin/env node
// Guardrail L3: "sin checks silenciados ni piso de pruebas debilitado".
//  1) Falla si un PR AÑADE líneas que silencian o saltan pruebas/checks (skip, only, xit, || true, continue-on-error...).
//  2) Falla si el número de pruebas del repo baja del piso guardado en scripts/guardrails/test-floor.json,
//     o si el piso del PR es menor que el piso que ya tiene la rama base (el piso solo puede subir).
// Uso: node scripts/guardrails/no-weakened-checks.mjs --base origin/main
//      node scripts/guardrails/no-weakened-checks.mjs --actualizar-piso   (reescribe el piso con el conteo actual)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const PATRONES = [
  { id: "test-skip", re: /\b(?:it|test|describe)\.(?:skip|only|todo)\b/, msg: "prueba saltada o aislada (skip/only/todo)" },
  { id: "x-test", re: /\bx(?:it|describe|test)\s*\(/, msg: "prueba desactivada con xit/xdescribe/xtest" },
  { id: "or-true", re: /\|\|\s*true\b/, msg: '"|| true" silencia un fallo' },
  { id: "continue-on-error", re: /continue-on-error\s*:\s*true\b/, msg: "continue-on-error: true silencia un check" },
  { id: "pass-no-tests", re: /--passWithNoTests/, msg: "--passWithNoTests acepta suites vacías" },
  { id: "ts-nocheck", re: /@ts-nocheck/, msg: "@ts-nocheck apaga el chequeo de tipos" },
  { id: "if-false", re: /^\s*if\s*:\s*(?:false|\$\{\{\s*false\s*\}\})\s*$/, msg: "if: false desactiva un paso o job" },
];

const EXTENSIONES = /\.(?:ts|tsx|js|mjs|cjs|json|ya?ml|sh|astro)$/;
const EXCLUIDOS = [/^scripts\/guardrails\//, /^tests\/guardrails\//, /^docs\//, /package-lock\.json$/];

export function esArchivoRevisable(ruta) {
  return EXTENSIONES.test(ruta) && !EXCLUIDOS.some((r) => r.test(ruta));
}

/** Devuelve las violaciones en las líneas AÑADIDAS de un diff unificado. */
export function analizarDiff(diff) {
  const violaciones = [];
  let archivo = null;
  let linea = 0;
  for (const raw of diff.split("\n")) {
    if (raw.startsWith("+++ ")) {
      const m = raw.match(/^\+\+\+ b\/(.+)$/);
      archivo = m ? m[1] : null;
      continue;
    }
    const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      linea = Number(hunk[1]);
      continue;
    }
    if (!archivo || !esArchivoRevisable(archivo)) continue;
    if (raw.startsWith("+") && !raw.startsWith("+++")) {
      const texto = raw.slice(1);
      for (const p of PATRONES) {
        if (p.re.test(texto)) violaciones.push({ archivo, linea, id: p.id, msg: p.msg, texto: texto.trim() });
      }
      linea += 1;
    } else if (!raw.startsWith("-")) {
      linea += 1;
    }
  }
  return violaciones;
}

/** Cuenta casos de prueba (líneas que empiezan con it( o test( en archivos *.spec|test.*). Es una aproximación conservadora. */
export function contarPruebas(archivos, leer = (f) => readFileSync(f, "utf8")) {
  let total = 0;
  for (const f of archivos) {
    if (!/\.(?:spec|test)\.(?:ts|tsx|js|mjs)$/.test(f)) continue;
    for (const l of leer(f).split("\n")) if (/^\s*(?:it|test)\s*\(/.test(l)) total += 1;
  }
  return total;
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
const RUTA_PISO = "scripts/guardrails/test-floor.json";

function archivosRastreados() {
  return git("ls-files").split("\n").filter(Boolean).filter((f) => existsSync(f));
}

function main() {
  const args = process.argv.slice(2);
  const enCI = process.env.GITHUB_ACTIONS === "true";
  const conteo = contarPruebas(archivosRastreados());

  if (args.includes("--actualizar-piso")) {
    writeFileSync(RUTA_PISO, JSON.stringify({ minimoPruebas: conteo }, null, 2) + "\n");
    console.log(`Piso actualizado a ${conteo} pruebas. Súbelo en un PR; nunca lo bajes.`);
    return 0;
  }

  const i = args.indexOf("--base");
  const base = i >= 0 ? args[i + 1] : "origin/main";
  const problemas = [];

  let diff = "";
  try {
    diff = git("diff", "--unified=0", `${base}...HEAD`);
  } catch {
    console.error(`No se pudo calcular el diff contra ${base}. ¿Hiciste checkout con fetch-depth: 0?`);
    return 2;
  }
  for (const v of analizarDiff(diff)) {
    problemas.push(`${v.archivo}:${v.linea}  ${v.msg}  →  ${v.texto}`);
    if (enCI) console.log(`::error file=${v.archivo},line=${v.linea}::${v.msg}`);
  }

  const pisoPR = existsSync(RUTA_PISO) ? JSON.parse(readFileSync(RUTA_PISO, "utf8")).minimoPruebas : null;
  let pisoBase = null;
  try {
    pisoBase = JSON.parse(git("show", `${base}:${RUTA_PISO}`)).minimoPruebas;
  } catch {
    console.log(`Aviso: ${base} aún no tiene ${RUTA_PISO}; se usa solo el piso de este PR.`);
  }
  if (pisoPR === null && pisoBase === null) {
    problemas.push(`No existe ${RUTA_PISO}. Créalo con --actualizar-piso.`);
  } else {
    if (pisoBase !== null && (pisoPR ?? 0) < pisoBase) {
      problemas.push(`El piso de pruebas bajó de ${pisoBase} a ${pisoPR ?? "∅"}. El piso solo puede subir.`);
    }
    const piso = Math.max(pisoPR ?? 0, pisoBase ?? 0);
    if (conteo < piso) problemas.push(`Hay ${conteo} pruebas y el piso exige ${piso}. ¿Borraste o desactivaste pruebas?`);
  }

  if (problemas.length) {
    console.error("Guardrail anti-debilitamiento: FALLÓ");
    for (const p of problemas) console.error("  ✗ " + p);
    return 1;
  }
  console.log(`Guardrail anti-debilitamiento: OK (${conteo} pruebas, sin checks silenciados).`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
