import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDocument } from "yaml";

// Regresión del bug "web.yml tiene YAML inválido": un workflow que no parsea no corre y nadie se entera.
const carpeta = fileURLToPath(new URL("../../.github/workflows", import.meta.url));
const workflows = readdirSync(carpeta).filter((f) => /\.ya?ml$/.test(f));

describe("workflows de GitHub Actions", () => {
  it("hay al menos un workflow", () => {
    expect(workflows.length).toBeGreaterThan(0);
  });

  for (const archivo of workflows) {
    it(`${archivo} es YAML válido`, () => {
      const doc = parseDocument(readFileSync(join(carpeta, archivo), "utf8"));
      expect(doc.errors.map((e) => e.message)).toEqual([]);
    });

    it(`${archivo} define jobs y cada paso tiene run o uses`, () => {
      const data = parseDocument(readFileSync(join(carpeta, archivo), "utf8")).toJS() as {
        jobs?: Record<string, { steps?: Array<Record<string, unknown>> }>;
      };
      expect(data?.jobs).toBeTruthy();
      for (const job of Object.values(data.jobs ?? {})) {
        for (const paso of job.steps ?? []) {
          expect("run" in paso || "uses" in paso).toBe(true);
        }
      }
    });
  }
});
