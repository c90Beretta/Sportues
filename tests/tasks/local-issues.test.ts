import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  archivarIssue,
  asignarIssue,
  cambiarEstado,
  crearIssue,
  filtrarBacklog,
  parsearIssue,
  registrarRevision,
  validarBacklog,
  validarIssue,
} from "../../scripts/tasks/issues.mjs";

const temporales: string[] = [];

async function crearRaiz() {
  const raiz = await fs.mkdtemp(path.join(os.tmpdir(), "sportues-local-issues-"));
  temporales.push(raiz);
  await fs.mkdir(path.join(raiz, ".tasks"), { recursive: true });
  await fs.writeFile(
    path.join(raiz, ".tasks", "config.json"),
    JSON.stringify({
      version: 1,
      nextIssueNumber: 1,
      statuses: ["backlog", "ready", "in_progress", "in_review", "done", "blocked"],
      transitions: {
        backlog: ["ready", "blocked"],
        ready: ["backlog", "in_progress", "blocked"],
        in_progress: ["ready", "in_review", "blocked"],
        in_review: ["in_progress", "done", "blocked"],
        done: ["in_progress"],
        blocked: ["backlog", "ready"],
      },
    }),
  );
  return raiz;
}

async function crear(raiz: string, opciones: Record<string, unknown> = {}) {
  return crearIssue({ raiz, title: "Issue de prueba", type: "task", ...opciones });
}

async function preparar(raiz: string, id: string) {
  const ruta = path.join(raiz, ".tasks", "issues", `${id}.md`);
  const contenido = await fs.readFile(ruta, "utf8");
  await fs.writeFile(
    ruta,
    contenido
      .replace("Pendiente de definir.\n\n## Definition of Ready", "- **Given** el estado inicial.\n- **When** se ejecuta la tarea.\n- **Then** se verifica el resultado.\n\n## Definition of Ready")
      .replace(/(## Definition of Ready\n)([\s\S]*?)(\n## Definition of Done)/, (_seccion, encabezado, contenidoDoR, cierre) =>
        `${encabezado}${contenidoDoR.replaceAll("- [ ]", "- [x]")}${cierre}`),
  );
  await asignarIssue(raiz, id, "ana");
  await cambiarEstado(raiz, id, "ready");
}

async function completarDefinitionDone(ruta: string) {
  const contenido = await fs.readFile(ruta, "utf8");
  await fs.writeFile(
    ruta,
    contenido.replace(/(## Definition of Done\n)([\s\S]*?)(\n## Plan de implementación)/, (_seccion, encabezado, contenidoDoD, cierre) =>
      `${encabezado}${contenidoDoD.replaceAll("- [ ]", "- [x]")}${cierre}`),
  );
}

afterEach(async () => {
  await Promise.all(temporales.splice(0).map((ruta) => fs.rm(ruta, { recursive: true, force: true })));
});

describe("gestor local de Issues", () => {
  it("crea Issues Markdown con Frontmatter completo e ID persistente", async () => {
    const raiz = await crearRaiz();
    const primero = await crear(raiz, { priority: "high", github_issue: 42 });
    const segundo = await crear(raiz);
    const contenido = await fs.readFile(primero.ruta, "utf8");
    const issue = parsearIssue(contenido, primero.ruta);

    expect(primero.id).toBe("ISSUE-001");
    expect(segundo.id).toBe("ISSUE-002");
    expect(issue.frontmatter).toMatchObject({
      title: "Issue de prueba",
      status: "backlog",
      priority: "high",
      github_issue: 42,
      assignees: [],
      dependencies: [],
    });
    expect(validarIssue(issue, { ruta: primero.ruta })).toEqual([]);
  });

  it("expone creación y consulta mediante el comando local", async () => {
    const raiz = await crearRaiz();
    const cli = path.resolve("scripts/tasks/issues.mjs");
    const creado = spawnSync(process.execPath, [
      cli,
      "create",
      "--title",
      "Reporte semanal",
      "--type",
      "feature",
      "--github-issue",
      "38",
    ], { cwd: raiz, encoding: "utf8" });

    expect(creado.status).toBe(0);
    expect(creado.stdout).toContain("Creado ISSUE-001");
    expect(creado.stderr).toBe("");
    const listado = spawnSync(process.execPath, [cli, "list", "--status", "backlog"], {
      cwd: raiz,
      encoding: "utf8",
    });
    expect(listado.status).toBe(0);
    expect(listado.stdout).toContain("ISSUE-001  Reporte semanal");
    expect(listado.stdout).toContain("MEDIUM");
  });

  it("valida formato, propiedades requeridas y estados permitidos", async () => {
    const raiz = await crearRaiz();
    const { ruta } = await crear(raiz);
    const issue = parsearIssue(await fs.readFile(ruta, "utf8"));
    issue.frontmatter.status = "in-progress";
    issue.frontmatter.id = "mal";

    expect(validarIssue(issue, { ruta })).toEqual(expect.arrayContaining([
      expect.stringContaining("id debe tener formato"),
      expect.stringContaining("status no permitido"),
      expect.stringContaining("nombre del archivo no coincide"),
    ]));
    expect(() => parsearIssue("# sin Frontmatter")).toThrow("falta YAML Frontmatter");
  });

  it("no reutiliza IDs aunque se elimine un archivo local", async () => {
    const raiz = await crearRaiz();
    const primero = await crear(raiz);
    await fs.rm(primero.ruta);

    const segundo = await crear(raiz);

    expect(segundo.id).toBe("ISSUE-002");
  });

  it("exige transición válida, criterios, responsable y dependencias completadas para Ready", async () => {
    const raiz = await crearRaiz();
    const issue = await crear(raiz);
    await expect(cambiarEstado(raiz, issue.id, "in_progress")).rejects.toThrow("Transición no permitida");
    await expect(cambiarEstado(raiz, issue.id, "ready")).rejects.toThrow("faltan criterios");

    await preparar(raiz, issue.id);
    const enProgreso = await cambiarEstado(raiz, issue.id, "in_progress");
    expect(enProgreso.frontmatter.status).toBe("in_progress");
    await expect(cambiarEstado(raiz, issue.id, "done")).rejects.toThrow("Transición no permitida");
  });

  it("filtra por estado, responsable y prioridad e identifica Ready sin bloqueos", async () => {
    const raiz = await crearRaiz();
    const listo = await crear(raiz, { priority: "high" });
    const backlog = await crear(raiz, { priority: "low" });
    await preparar(raiz, listo.id);
    await asignarIssue(raiz, backlog.id, "bea");

    await expect(filtrarBacklog(raiz, { ready: true })).resolves.toHaveLength(1);
    await expect(filtrarBacklog(raiz, { status: "backlog", assignee: "bea", priority: "low" })).resolves.toHaveLength(1);
    await expect(filtrarBacklog(raiz, { assignee: "nadie" })).resolves.toHaveLength(0);
  });

  it("comprueba dependencias y detecta ciclos o referencias inexistentes", async () => {
    const raiz = await crearRaiz();
    await expect(crear(raiz, { dependencies: ["ISSUE-999"] })).rejects.toThrow("no existe localmente");
    const dependencia = await crear(raiz, { title: "Dependencia" });
    const issue = await crear(raiz, { title: "Dependiente", dependencies: [dependencia.id] });
    await asignarIssue(raiz, issue.id, "ana");
    await expect(cambiarEstado(raiz, issue.id, "ready")).rejects.toThrow("dependencias pendientes");
    await expect(filtrarBacklog(raiz, { blocked: true })).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ frontmatter: expect.objectContaining({ id: issue.id }) })]),
    );

    await preparar(raiz, dependencia.id);
    await cambiarEstado(raiz, dependencia.id, "in_progress");
    await cambiarEstado(raiz, dependencia.id, "in_review");
    await completarDefinitionDone(dependencia.ruta);
    await cambiarEstado(raiz, dependencia.id, "done");
    await preparar(raiz, issue.id);
    const resultado = await validarBacklog(raiz);
    expect(resultado.errores).toEqual([]);

    const ruta = path.join(raiz, ".tasks", "issues", `${issue.id}.md`);
    const contenido = await fs.readFile(ruta, "utf8");
    await fs.writeFile(ruta, contenido.replace("dependencies:\n  - ISSUE-001", `dependencies:\n  - ${issue.id}`));
    const conCiclo = await validarBacklog(raiz);
    expect(conCiclo.errores.some((error) => error.includes("Ciclo de dependencias"))).toBe(true);
  });

  it("rechaza escrituras solapadas y conserva IDs duplicados como error visible", async () => {
    const raiz = await crearRaiz();
    const issue = await crear(raiz);
    const antes = await fs.readFile(issue.ruta, "utf8");
    await fs.writeFile(path.join(raiz, ".tasks", ".write.lock"), "ocupado");

    await expect(asignarIssue(raiz, issue.id, "ana")).rejects.toThrow("otra escritura en curso");
    await fs.rm(path.join(raiz, ".tasks", ".write.lock"));
    await expect(cambiarEstado(raiz, issue.id, "in_progress")).rejects.toThrow("Transición no permitida");
    await expect(fs.readFile(issue.ruta, "utf8")).resolves.toBe(antes);

    const copia = path.join(raiz, ".tasks", "archive", "closed", `${issue.id}.md`);
    await fs.mkdir(path.dirname(copia), { recursive: true });
    await fs.copyFile(issue.ruta, copia);
    const validacion = await validarBacklog(raiz);
    expect(validacion.errores.some((error) => error.includes(`ID duplicado ${issue.id}`))).toBe(true);
  });

  it("archiva únicamente Issues Done sin sobrescribir el destino", async () => {
    const raiz = await crearRaiz();
    const issue = await crear(raiz);
    await expect(archivarIssue(raiz, issue.id)).rejects.toThrow("Solo se pueden archivar");
    await preparar(raiz, issue.id);
    await cambiarEstado(raiz, issue.id, "in_progress");
    await cambiarEstado(raiz, issue.id, "in_review");
    await completarDefinitionDone(issue.ruta);
    await cambiarEstado(raiz, issue.id, "done");

    const destino = path.join(raiz, ".tasks", "archive", "closed", `${issue.id}.md`);
    const contenidoDestino = await fs.readFile(issue.ruta, "utf8");
    await fs.writeFile(destino, contenidoDestino);
    await expect(archivarIssue(raiz, issue.id)).rejects.toThrow();
    await expect(fs.readFile(destino, "utf8")).resolves.toBe(contenidoDestino);
    await fs.rm(destino);

    const archivado = await archivarIssue(raiz, issue.id);

    expect(archivado.ruta).toContain(path.join("archive", "closed"));
    await expect(fs.access(issue.ruta)).rejects.toThrow();
    expect((await validarBacklog(raiz)).errores).toEqual([]);
  });

  it("registra revisiones localmente sin editar los criterios de aceptación", async () => {
    const raiz = await crearRaiz();
    const issue = await crear(raiz);
    const before = parsearIssue(await fs.readFile(issue.ruta, "utf8")).cuerpo;
    await registrarRevision(raiz, issue.id, "ITERATE", ["Corregir evidencia de pruebas"]);
    const after = parsearIssue(await fs.readFile(issue.ruta, "utf8")).cuerpo;

    expect(after).toContain("## Revisión local ·");
    expect(after).toContain("Corregir evidencia de pruebas");
    expect(after.slice(0, after.indexOf("## Revisión local"))).toContain(
      before.slice(0, before.indexOf("## Definition of Ready")),
    );
    await expect(registrarRevision(raiz, issue.id, "ITERATE", [])).rejects.toThrow("requiere al menos un hallazgo");
  });
});
