import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  validarComandoImplementacion,
  validarComandoRevision,
} from "../../scripts/guardrails/agent-permissions.mjs";

const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "sportues-agent-permissions-"));

function escribir(nombre, contenido) {
  const ruta = path.join(temporal, nombre);
  fs.writeFileSync(ruta, contenido);
  return ruta;
}

afterAll(() => fs.rmSync(temporal, { recursive: true, force: true }));

describe("guardrail: permisos de agentes", () => {
  it("acepta los comandos reales", () => {
    expect(validarComandoImplementacion(".claude/commands/implementar-issue.md")).toEqual([]);
    expect(validarComandoRevision(".claude/commands/revisar-pr.md")).toEqual([]);
  });

  it("exige gh issue view en implementación", () => {
    const ruta = escribir("impl-sin-issue-view.md", `---
description: prueba
allowed-tools: Read, Grep, Glob, Edit, AskUserQuestion, Bash(git status:*), Bash(git diff:*), Bash(npm run test:frontend:*), Bash(npm run test --workspace=api:*), Bash(npm run build:*)
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
`);
    expect(validarComandoImplementacion(ruta).some((error) => error.includes("gh issue view"))).toBe(true);
  });

  it("exige gh pr view y gh pr diff, y rechaza gh pr comment", () => {
    const permisos = [
      "Bash(gh pr view:*)",
      "Bash(gh pr diff:*)",
    ];

    for (const permiso of permisos) {
      const permitido = permisos.filter((actual) => actual !== permiso).join(", ");
      const ruta = escribir(`review-sin-${permiso.replaceAll(/[^a-z0-9]/gi, "-")}.md`, `---
description: prueba
allowed-tools: Read, Grep, Glob, ${permitido}
---
Deja comentarios generales o sugerencias.
Está prohibido --edit-last.
Está prohibido --delete-last.
Está prohibido --edit.
Está prohibido --delete.
Está prohibido --create-if-none.
Está prohibido --web.
`);
      expect(validarComandoRevision(ruta).some((error) => error.includes(permiso.includes("view") ? "gh pr view" : "gh pr diff"))).toBe(true);
    }

    const conComentario = escribir("review-con-gh-pr-comment.md", `---
description: prueba
allowed-tools: Read, Grep, Glob, Bash(gh pr view:*), Bash(gh pr diff:*), Bash(gh pr comment:*)
---
Deja comentarios generales o sugerencias.
Está prohibido --edit-last.
Está prohibido --delete-last.
Está prohibido --edit.
Está prohibido --delete.
Está prohibido --create-if-none.
Está prohibido --web.
`);
    expect(validarComandoRevision(conComentario).some((error) => error.includes("gh pr comment"))).toBe(true);
  });

  it("rechaza permisos Bash más amplios de los necesarios", () => {
    const impl = escribir("impl-bash-amplio.md", `---
description: prueba
allowed-tools: Read, Grep, Glob, Edit, AskUserQuestion, Bash(git status:*), Bash(git diff:*), Bash(gh issue view:*), Bash(npm run test:frontend:*), Bash(npm run test --workspace=api:*), Bash(npm run build:*), Bash
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
`);
    expect(validarComandoImplementacion(impl).some((error) => error.includes("fuera del manifiesto"))).toBe(true);

    const review = escribir("review-gh-amplio.md", `---
description: prueba
allowed-tools: Read, Grep, Glob, Bash(gh pr:*), Bash(gh pr comment:*), Bash(gh pr view:*), Bash(gh pr diff:*)
---
Deja comentarios generales o sugerencias.
Está prohibido --edit-last.
Está prohibido --delete-last.
Está prohibido --edit.
Está prohibido --delete.
Está prohibido --create-if-none.
Está prohibido --web.
`);
    expect(validarComandoRevision(review).some((error) => error.includes("fuera del manifiesto"))).toBe(true);
  });

  it("rechaza una puerta humana que permite continuar automáticamente", () => {
    const ruta = escribir("implantacion-auto.md", `---
description: prueba
allowed-tools: Read
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** si no responde, continúa automáticamente.
## Fase 2: implementación solo después de aprobar
`);
    expect(validarComandoImplementacion(ruta).length).toBeGreaterThan(0);
  });

  it("rechaza mutaciones git", () => {
    for (const mutacion of [
      "git switch feature/x",
      "git branch feature/x",
      "git merge main",
      "git commit -m test",
      "git push",
      "git checkout main",
      "git rebase main",
      "git reset --hard main",
    ]) {
      const ruta = escribir(`impl-${mutacion.replaceAll(/[^a-z0-9]/gi, "-")}.md`, `---
description: prueba
allowed-tools: Read
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
${mutacion}
`);
      expect(validarComandoImplementacion(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza gh, REST, GraphQL y clientes HTTP", () => {
    for (const mutacion of [
      "gh pr merge 10",
      "gh pr review --approve",
      "gh api --method POST repos/c90Beretta/Sportues/pulls/10/reviews",
      "gh api graphql -f query='mutation { mergePullRequest }'",
      "curl -X PUT https://api.github.com/repos/c90Beretta/Sportues/pulls/10/merge",
      "wget --method=POST https://api.github.com/repos/c90Beretta/Sportues/pulls/10/reviews",
    ]) {
      const ruta = escribir(`bypass-${mutacion.slice(0, 18).replaceAll(/[^a-z0-9]/gi, "-")}.md`, `---
description: prueba
allowed-tools: Read
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
${mutacion}
`);
      expect(validarComandoImplementacion(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza expansiones shell, intérpretes y encadenamiento", () => {
    for (const bypass of [
      "bash -c 'git push'",
      "node -e 'fetch(\"https://api.github.com/repos/x\")'",
      "python -c 'import requests'",
      "git status && git push",
      "gh pr comment 10 --body `echo hack`",
      "gh pr comment 10 --body $(printf hack)",
      "env gh pr merge 10",
      "sudo gh pr review --approve",
      "alias gh='gh -R c90Beretta/Sportues'",
      "source ./mutate.sh",
      "printf 'gh pr merge 10' | bash",
      "xargs gh pr merge",
    ]) {
      const ruta = escribir(`shell-${Math.random()}.md`, `---
description: prueba
allowed-tools: Read
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
${bypass}
`);
      expect(validarComandoImplementacion(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza edición, borrado y formal review en el revisor", () => {
    for (const opcion of [
      "--edit-last",
      "--delete-last",
      "--edit",
      "--delete",
      "--create-if-none",
      "--web",
    ]) {
      const ruta = escribir(`review-${opcion.slice(2)}.md`, `---
description: prueba
allowed-tools: Read, Grep, Glob, Bash(gh pr comment:*)
---
Deja comentarios generales o sugerencias.
Está prohibido ${opcion}.
gh pr comment 10 --body nuevo ${opcion}
`);
      expect(validarComandoRevision(ruta).length).toBeGreaterThan(0);
    }

    for (const mutacion of [
      "gh pr review --approve",
      "gh pr review --request-changes",
      "gh pr merge 10",
      "gh api --method POST repos/c90Beretta/Sportues/pulls/10/reviews",
    ]) {
      const ruta = escribir(`review-${mutacion.replaceAll(/[^a-z0-9]/gi, "-")}.md`, `---
description: prueba
allowed-tools: Read, Grep, Glob
---
Deja comentarios generales o sugerencias.
Está prohibido --edit-last.
Está prohibido --delete-last.
Está prohibido --edit.
Está prohibido --delete.
Está prohibido --create-if-none.
Está prohibido --web.
${mutacion}
`);
      expect(validarComandoRevision(ruta).length).toBeGreaterThan(0);
    }
  });

  it("rechaza herramientas fuera del manifiesto", () => {
    const impl = escribir("impl-bash.md", `---
description: prueba
allowed-tools: Read, Bash
---
## Fase 1: planificación obligatoria
**Puerta humana obligatoria:** aprobación humana explícita que nombre el plan aprobado.
## Fase 2: implementación solo después de aprobar
`);
    expect(validarComandoImplementacion(impl).length).toBeGreaterThan(0);

    const review = escribir("review-edit.md", `---
description: prueba
allowed-tools: Read, Edit
---
Deja comentarios generales o sugerencias.
Está prohibido --edit-last.
Está prohibido --delete-last.
Está prohibido --edit.
Está prohibido --delete.
Está prohibido --create-if-none.
Está prohibido --web.
`);
    expect(validarComandoRevision(review).length).toBeGreaterThan(0);
  });
});
