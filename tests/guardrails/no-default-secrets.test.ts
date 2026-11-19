import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Regresión del bug "secreto JWT por defecto escrito en el código": ningún código fuente puede traer un secreto de respaldo.
const raiz = fileURLToPath(new URL("../..", import.meta.url));
const IGNORAR = new Set(["node_modules", "dist", "dist-esm", ".next", ".astro", "coverage", ".git"]);

function* archivosFuente(dir: string): Generator<string> {
  for (const nombre of readdirSync(dir)) {
    if (IGNORAR.has(nombre)) continue;
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) yield* archivosFuente(ruta);
    else if (/\.(?:ts|tsx|astro|mjs|js)$/.test(nombre) && !/\.(?:spec|test)\./.test(nombre)) yield ruta;
  }
}

describe("secretos por defecto", () => {
  it('ningún archivo de apps/ ni packages/ usa "dev-secret" como valor de respaldo', () => {
    const culpables: string[] = [];
    for (const base of ["apps", "packages"]) {
      for (const f of archivosFuente(join(raiz, base))) {
        if (/dev-secret/.test(readFileSync(f, "utf8"))) culpables.push(relative(raiz, f));
      }
    }
    expect(culpables).toEqual([]);
  });
});
