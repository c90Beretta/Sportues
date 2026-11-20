import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  validarAgenteImplementacion,
  validarAgenteRevision,
  validarMigracionCopilot,
} from "../../scripts/guardrails/agent-permissions.mjs";

const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "sportues-copilot-agents-"));

function escribir(nombre, contenido) {
  const ruta = path.join(temporal, nombre);
  fs.writeFileSync(ruta, contenido);
  return ruta;
}

afterAll(() => fs.rmSync(temporal, { recursive: true, force: true }));

describe("guardrail: agentes nativos de Copilot", () => {
  it("acepta los agentes y elimina los archivos operativos de Claude", () => {
    expect(validarMigracionCopilot()).toEqual([]);
    expect(validarAgenteImplementacion(".github/agents/implementador-issue.agent.md")).toEqual([]);
    expect(validarAgenteRevision(".github/agents/revisor-pr.agent.md")).toEqual([]);
  });

  it("rechaza un implementador sin aprobación humana explícita", () => {
    const ruta = escribir("implementador-sin-gate.agent.md", `---
name: implementador-issue
description: prueba
tools: ["read", "search", "edit", "execute"]
strict-tools-list: true
include-custom-instructions: true
---
Presenta el plan y continúa automáticamente.
git status
git diff
gh issue view
npm run test:frontend
npm run test --workspace=api
npm run build
`);
    expect(validarAgenteImplementacion(ruta).some((error) => error.includes("aprobación humana"))).toBe(true);
  });

  it("rechaza herramientas de implementación fuera del manifiesto", () => {
    const ruta = escribir("implementador-amplio.agent.md", `---
name: implementador-issue
description: prueba
tools: ["read", "search", "edit", "execute", "agent"]
strict-tools-list: true
include-custom-instructions: true
---
¿Apruebas este plan antes de implementar?
Las restricciones estáticas no constituyen una sandbox.
git status
git diff
gh issue view
npm run test:frontend
npm run test --workspace=api
npm run build
`);
    expect(validarAgenteImplementacion(ruta).some((error) => error.includes("manifiesto"))).toBe(true);
  });

  it("rechaza un revisor con edición o ejecución", () => {
    for (const herramientas of [
      '["read", "search", "edit"]',
      '["read", "search", "execute"]',
      '["read", "search", "github/*", "*"]',
    ]) {
      const ruta = escribir(`revisor-amplio-${herramientas.length}.agent.md`, `---
name: revisor-pr
description: prueba
tools: ${herramientas}
strict-tools-list: true
include-custom-instructions: true
---
No puedes editar archivos.
Nunca apruebes ni nunca fusionas.
gh pr view
gh pr diff
Las restricciones estáticas no constituyen una sandbox.
`);
      expect(validarAgenteRevision(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza mutaciones Git, PR, REST, GraphQL y intérpretes", () => {
    for (const mutacion of [
      "git commit -m test",
      "git push",
      "git merge main",
      "gh pr create",
      "gh pr review --approve",
      "gh pr merge 10",
      "gh api --method POST repos/c90Beretta/Sportues/pulls/10/reviews",
      "gh api graphql -f query='mutation { mergePullRequest }'",
      "curl -X PUT https://api.github.com/repos/c90Beretta/Sportues/pulls/10/merge",
      "node -e 'fetch(\"https://api.github.com/repos/x\")'",
    ]) {
      const ruta = escribir(`mutacion-${mutacion.replaceAll(/[^a-z0-9]/gi, "-")}.agent.md`, `---
name: implementador-issue
description: prueba
tools: ["read", "search", "edit", "execute"]
strict-tools-list: true
include-custom-instructions: true
---
¿Apruebas este plan antes de implementar?
Las restricciones estáticas no constituyen una sandbox.
git status
git diff
gh issue view
npm run test:frontend
npm run test --workspace=api
npm run build
${mutacion}
`);
      expect(validarAgenteImplementacion(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza cadenas, sustitución, alias y wrappers", () => {
    for (const bypass of [
      "git status && git push",
      "gh pr diff 10 --body $(printf hack)",
      "gh pr diff 10 --body `echo hack`",
      "bash -c 'git push'",
      "env gh pr merge 10",
      "sudo gh pr review --approve",
      "alias gh='gh pr merge'",
      "source ./mutate.sh",
      "printf 'git push' | bash",
      "xargs gh pr merge",
    ]) {
      const ruta = escribir(`bypass-${Math.random()}.agent.md`, `---
name: implementador-issue
description: prueba
tools: ["read", "search", "edit", "execute"]
strict-tools-list: true
include-custom-instructions: true
---
¿Apruebas este plan antes de implementar?
Las restricciones estáticas no constituyen una sandbox.
git status
git diff
gh issue view
npm run test:frontend
npm run test --workspace=api
npm run build
${bypass}
`);
      expect(validarAgenteImplementacion(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza que el revisor publique o modifique comentarios", () => {
    for (const opcion of ["--edit-last", "--delete-last", "--edit", "--delete", "--create-if-none", "--web"]) {
      const ruta = escribir(`revisor-comentario-${opcion.slice(2)}.agent.md`, `---
name: revisor-pr
description: prueba
tools: ["read", "search", "github/*"]
strict-tools-list: true
include-custom-instructions: true
---
No puedes editar archivos.
Nunca apruebes ni nunca fusionas.
gh pr view
gh pr diff
Las restricciones estáticas no constituyen una sandbox.
gh pr comment 10 ${opcion}
`);
      expect(validarAgenteRevision(ruta).length).toBeGreaterThan(0);
    }
  });
});
