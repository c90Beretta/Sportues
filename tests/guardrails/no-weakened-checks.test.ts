import { describe, expect, it } from "vitest";
// @ts-expect-error módulo .mjs sin tipos
import { analizarDiff, contarPruebas, esArchivoRevisable } from "../../scripts/guardrails/no-weakened-checks.mjs";

const diff = (archivo: string, lineas: string[]) =>
  [`diff --git a/${archivo} b/${archivo}`, `--- a/${archivo}`, `+++ b/${archivo}`, "@@ -1,0 +10,2 @@", ...lineas.map((l) => "+" + l)].join("\n");

describe("guardrail: líneas añadidas que debilitan checks", () => {
  it("detecta it.skip en una prueba", () => {
    const v = analizarDiff(diff("apps/api/src/a.spec.ts", ['it.skip("x", () => {});']));
    expect(v).toHaveLength(1);
    expect(v[0]).toMatchObject({ id: "test-skip", archivo: "apps/api/src/a.spec.ts", linea: 10 });
  });

  it("detecta xit, || true, continue-on-error y --passWithNoTests", () => {
    const ids = [
      ["apps/api/src/a.spec.ts", 'xit("x", () => {});'],
      [".github/workflows/ci.yml", "        run: npm test || true"],
      [".github/workflows/ci.yml", "        continue-on-error: true"],
      ["package.json", '"test": "jest --passWithNoTests"'],
    ].map(([f, l]) => analizarDiff(diff(f, [l]))[0]?.id);
    expect(ids).toEqual(["x-test", "or-true", "continue-on-error", "pass-no-tests"]);
  });

  it("no marca texto en docs ni en el propio guardrail", () => {
    expect(analizarDiff(diff("docs/framework.md", ["nunca uses `|| true`"]))).toEqual([]);
    expect(analizarDiff(diff("scripts/guardrails/no-weakened-checks.mjs", ["x || true"]))).toEqual([]);
  });

  it("ignora líneas eliminadas", () => {
    const d = ["+++ b/apps/api/src/a.spec.ts", "@@ -1,1 +1,0 @@", '-it.skip("x", () => {});'].join("\n");
    expect(analizarDiff(d)).toEqual([]);
  });

  it("solo revisa código y configuración", () => {
    expect(esArchivoRevisable("apps/web/src/a.tsx")).toBe(true);
    expect(esArchivoRevisable("README.md")).toBe(false);
  });
});

describe("guardrail: piso de pruebas", () => {
  it("cuenta it( y test( solo en archivos spec/test", () => {
    const fuentes: Record<string, string> = {
      "a.spec.ts": 'it("a", () => {});\n  test("b", () => {});\n// it("comentario")\nconst x = 1;',
      "b.ts": 'it("no cuenta", () => {});',
    };
    expect(contarPruebas(Object.keys(fuentes), (f: string) => fuentes[f])).toBe(2);
  });
});
