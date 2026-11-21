#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";

const ESTADOS = ["backlog", "ready", "in_progress", "in_review", "done", "blocked"];
const TIPOS = ["feature", "bug", "task", "documentation", "research"];
const PRIORIDADES = ["low", "medium", "high", "critical"];
const ORDEN_ESTADOS = ["backlog", "ready", "in_progress", "in_review", "blocked", "done"];
const PATRON_ID = /^ISSUE-(\d{3,})$/;

function rutaTasks(raiz) {
  return path.join(raiz, ".tasks");
}

function rutaConfig(raiz) {
  return path.join(rutaTasks(raiz), "config.json");
}

function fechaISO(fecha = new Date()) {
  return fecha.toISOString().slice(0, 10);
}

function validarFecha(valor, opcional = false) {
  if (valor === null && opcional) return true;
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

export function parsearIssue(contenido, origen = "Issue") {
  const coincidencia = contenido.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!coincidencia) {
    throw new Error(`${origen}: falta YAML Frontmatter delimitado por ---`);
  }

  let frontmatter;
  try {
    frontmatter = parse(coincidencia[1]);
  } catch (error) {
    throw new Error(`${origen}: Frontmatter YAML inválido: ${error.message}`);
  }

  if (!frontmatter || typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    throw new Error(`${origen}: el Frontmatter debe ser un objeto YAML`);
  }

  return { frontmatter, cuerpo: coincidencia[2] };
}

export function validarIssue(issue, { ruta } = {}) {
  const errores = [];
  const dato = issue.frontmatter;
  const origen = ruta ?? dato.id ?? "Issue";

  if (typeof dato.id !== "string" || !PATRON_ID.test(dato.id)) {
    errores.push(`${origen}: id debe tener formato ISSUE-NNN`);
  }
  if (ruta && dato.id && path.basename(ruta, ".md") !== dato.id) {
    errores.push(`${origen}: el nombre del archivo no coincide con ${dato.id}`);
  }
  if (typeof dato.title !== "string" || dato.title.trim() === "") {
    errores.push(`${origen}: title es obligatorio`);
  }
  if (!TIPOS.includes(dato.type)) {
    errores.push(`${origen}: type no permitido (${dato.type ?? "vacío"})`);
  }
  if (!ESTADOS.includes(dato.status)) {
    errores.push(`${origen}: status no permitido (${dato.status ?? "vacío"})`);
  }
  if (!PRIORIDADES.includes(dato.priority)) {
    errores.push(`${origen}: priority no permitida (${dato.priority ?? "vacía"})`);
  }
  if (!validarFecha(dato.created_at)) errores.push(`${origen}: created_at debe ser una fecha ISO válida`);
  if (!validarFecha(dato.updated_at)) errores.push(`${origen}: updated_at debe ser una fecha ISO válida`);
  if (!validarFecha(dato.due_date, true)) errores.push(`${origen}: due_date debe ser una fecha ISO o null`);
  if (dato.milestone !== null && typeof dato.milestone !== "string") {
    errores.push(`${origen}: milestone debe ser texto o null`);
  }
  if (dato.github_issue !== null && (!Number.isInteger(dato.github_issue) || dato.github_issue < 1)) {
    errores.push(`${origen}: github_issue debe ser un entero positivo o null`);
  }

  for (const campo of ["labels", "assignees", "related_issues", "dependencies"]) {
    if (!Array.isArray(dato[campo]) || dato[campo].some((valor) => typeof valor !== "string")) {
      errores.push(`${origen}: ${campo} debe ser una lista de texto`);
    }
  }

  for (const seccion of [
    "Descripción",
    "Contexto",
    "Criterios de aceptación",
    "Definition of Ready",
    "Definition of Done",
    "Plan de implementación",
    "Evidencias",
    "Historial",
  ]) {
    if (!issue.cuerpo.split(/\r?\n/).some((linea) => linea.trim() === `## ${seccion}`)) {
      errores.push(`${origen}: falta la sección ${seccion}`);
    }
  }
  if (issue.cuerpo && !leerSeccion(issue.cuerpo, "Historial")) {
    errores.push(`${origen}: Historial no puede estar vacío`);
  }

  return errores;
}

async function leerConfig(raiz) {
  const contenido = await fs.readFile(rutaConfig(raiz), "utf8");
  let config;
  try {
    config = JSON.parse(contenido);
  } catch (error) {
    throw new Error(`.tasks/config.json no contiene JSON válido: ${error.message}`);
  }
  if (config.version !== 1 || !Number.isSafeInteger(config.nextIssueNumber) || config.nextIssueNumber < 1) {
    throw new Error(".tasks/config.json no cumple la versión o el contador de IDs esperado");
  }
  if (!Array.isArray(config.statuses) || config.statuses.join("|") !== ESTADOS.join("|")) {
    throw new Error(".tasks/config.json contiene estados no compatibles");
  }
  return config;
}

async function escribirAtomico(ruta, contenido) {
  const temporal = `${ruta}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporal, contenido, { flag: "wx" });
    await fs.rename(temporal, ruta);
  } catch (error) {
    await fs.rm(temporal, { force: true });
    throw error;
  }
}

async function conBloqueo(raiz, operacion) {
  const lock = path.join(rutaTasks(raiz), ".write.lock");
  let descriptor;
  try {
    descriptor = await fs.open(lock, "wx");
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error(`Ya existe ${path.relative(raiz, lock)}; verifica que no haya otra escritura en curso. Si quedó de un proceso terminado, retíralo manualmente.`);
    }
    throw error;
  }

  try {
    await descriptor.writeFile(`${JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() })}\n`);
    return await operacion();
  } finally {
    await descriptor.close();
    await fs.rm(lock, { force: true });
  }
}

async function listarArchivosIssues(raiz) {
  const directorios = [
    path.join(rutaTasks(raiz), "issues"),
    path.join(rutaTasks(raiz), "archive", "closed"),
  ];
  const encontrados = [];

  for (const directorio of directorios) {
    let entradas;
    try {
      entradas = await fs.readdir(directorio, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const entrada of entradas) {
      if (entrada.isFile() && entrada.name.endsWith(".md")) {
        encontrados.push(path.join(directorio, entrada.name));
      }
    }
  }

  return encontrados.sort();
}

async function leerTodos(raiz) {
  const issues = [];
  for (const ruta of await listarArchivosIssues(raiz)) {
    const contenido = await fs.readFile(ruta, "utf8");
    const issue = parsearIssue(contenido, path.relative(raiz, ruta));
    issue.ruta = ruta;
    issue.errores = validarIssue(issue, { ruta });
    issues.push(issue);
  }
  return issues;
}

async function leerBacklogValido(raiz) {
  const { issues, errores } = await validarBacklog(raiz);
  if (errores.length) throw new Error(errores.join("\n"));
  return issues;
}

function asunto(cuerpo, titulo) {
  const seccion = leerSeccion(cuerpo, "Criterios de aceptación");
  const criterios = seccion
    .split(/\r?\n/)
    .map((linea) => linea.replace(/^\s*[-*]\s*/, "").trim())
    .filter((linea) => linea && !/^pendiente(?:\s+de\s+definir)?\.?$/i.test(linea));
  if (!criterios.length) return `${titulo}: faltan criterios de aceptación`;
  return null;
}

function leerSeccion(cuerpo, titulo) {
  const lineas = cuerpo.split(/\r?\n/);
  const inicio = lineas.findIndex((linea) => linea.trim() === `## ${titulo}`);
  if (inicio < 0) return "";
  let fin = lineas.findIndex((linea, indice) => indice > inicio && /^##\s/.test(linea));
  if (fin < 0) fin = lineas.length;
  return lineas.slice(inicio + 1, fin).join("\n").trim();
}

function validarChecklist(cuerpo, titulo, nombre) {
  const seccion = leerSeccion(cuerpo, titulo);
  const casillas = [...seccion.matchAll(/^\s*-\s+\[([ xX])\]/gm)];
  if (casillas.length === 0) return [`${nombre}: falta el checklist de ${titulo}`];
  if (casillas.some((casilla) => casilla[1].toLowerCase() !== "x")) {
    return [`${nombre}: el checklist de ${titulo} tiene elementos pendientes`];
  }
  return [];
}

function dependenciasPendientes(issue, porId) {
  const dependencias = issue.frontmatter.dependencies;
  if (!Array.isArray(dependencias)) return [];
  return dependencias.filter((id) => {
    const dependencia = porId.get(id);
    return !dependencia || dependencia.frontmatter.status !== "done";
  });
}

function validarPreparacion(issue, porId) {
  const errores = [];
  const faltaCriterios = asunto(issue.cuerpo, issue.frontmatter.id);
  if (faltaCriterios) errores.push(faltaCriterios);
  errores.push(...validarChecklist(issue.cuerpo, "Definition of Ready", issue.frontmatter.id));
  if (!Array.isArray(issue.frontmatter.assignees) || issue.frontmatter.assignees.length === 0) {
    errores.push(`${issue.frontmatter.id}: Ready requiere al menos un responsable`);
  }
  const pendientes = dependenciasPendientes(issue, porId);
  if (pendientes.length) {
    errores.push(`${issue.frontmatter.id}: dependencias pendientes: ${pendientes.join(", ")}`);
  }
  return errores;
}

function parsearFrontmatter(frontmatter, cuerpo) {
  return `---\n${stringify(frontmatter).trimEnd()}\n---\n\n${cuerpo.trimStart()}`;
}

function construirCuerpo({ id, title, description = "", context = "" }) {
  return `# ${id} · ${title}

## Descripción
${description || "Pendiente de definir."}

## Contexto
${context || "Pendiente de definir."}

## Criterios de aceptación
Pendiente de definir.

## Definition of Ready
- [ ] Criterios de aceptación definidos.
- [ ] Responsable asignado.
- [ ] Sin bloqueos pendientes.

## Definition of Done
- [ ] Implementación terminada.
- [ ] Pruebas aprobadas.
- [ ] Documentación actualizada.
- [ ] Revisión humana completada.

## Plan de implementación
Pendiente de elaborar por el agente.

## Evidencias
- Pendiente.

## Historial
- ${fechaISO()}: Issue creado localmente.
`;
}

function normalizarLista(valor) {
  if (valor === undefined || valor === null || valor === "") return [];
  return String(valor).split(",").map((item) => item.trim()).filter(Boolean);
}

export async function crearIssue({
  raiz = process.cwd(),
  title,
  type,
  priority = "medium",
  labels = [],
  assignees = [],
  due_date = null,
  milestone = null,
  related_issues = [],
  dependencies = [],
  github_issue = null,
  description = "",
  context = "",
  ahora = new Date(),
} = {}) {
  if (typeof title !== "string" || title.trim() === "") throw new Error("--title es obligatorio");
  if (!TIPOS.includes(type)) throw new Error(`--type debe ser uno de: ${TIPOS.join(", ")}`);
  if (!PRIORIDADES.includes(priority)) throw new Error(`--priority debe ser uno de: ${PRIORIDADES.join(", ")}`);
  if (due_date !== null && !validarFecha(due_date)) throw new Error("--due-date debe ser YYYY-MM-DD");
  if (github_issue !== null && (!Number.isInteger(github_issue) || github_issue < 1)) {
    throw new Error("--github-issue debe ser un entero positivo");
  }

  await fs.mkdir(path.join(rutaTasks(raiz), "issues"), { recursive: true });
  await fs.mkdir(path.join(rutaTasks(raiz), "archive", "closed"), { recursive: true });

  return conBloqueo(raiz, async () => {
    const existentes = await leerBacklogValido(raiz);
    const ids = new Set(existentes.map((issue) => issue.frontmatter.id));
    const config = await leerConfig(raiz);
    let numero = config.nextIssueNumber;
    let id = `ISSUE-${String(numero).padStart(3, "0")}`;
    while (ids.has(id)) {
      numero += 1;
      id = `ISSUE-${String(numero).padStart(3, "0")}`;
    }

    const porId = new Map(existentes.map((issue) => [issue.frontmatter.id, issue]));
    for (const dependencia of dependencies) {
      if (!porId.has(dependencia)) throw new Error(`La dependencia ${dependencia} no existe localmente`);
    }

    config.nextIssueNumber = numero + 1;
    await escribirAtomico(rutaConfig(raiz), `${JSON.stringify(config, null, 2)}\n`);

    const fecha = fechaISO(ahora);
    const frontmatter = {
      id,
      title: title.trim(),
      type,
      status: "backlog",
      priority,
      labels,
      assignees,
      created_at: fecha,
      updated_at: fecha,
      due_date,
      milestone,
      related_issues,
      dependencies,
      github_issue,
    };
    const contenido = parsearFrontmatter(
      frontmatter,
      construirCuerpo({ id, title: frontmatter.title, description, context }),
    );
    const destino = path.join(rutaTasks(raiz), "issues", `${id}.md`);
    const descriptor = await fs.open(destino, "wx");
    try {
      await descriptor.writeFile(contenido, "utf8");
    } catch (error) {
      await fs.rm(destino, { force: true });
      throw error;
    } finally {
      await descriptor.close();
    }
    return { id, ruta: destino };
  });
}

export async function cambiarEstado(raiz, id, estado, ahora = new Date()) {
  if (!ESTADOS.includes(estado)) throw new Error(`Estado no permitido: ${estado}`);
  return conBloqueo(raiz, async () => {
    const issues = await leerBacklogValido(raiz);
    const porId = new Map(issues.map((issue) => [issue.frontmatter.id, issue]));
    const issue = porId.get(id);
    if (!issue) throw new Error(`${id} no existe localmente`);
    const config = await leerConfig(raiz);
    const actual = issue.frontmatter.status;
    const siguientes = config.transitions[actual] ?? [];
    if (!siguientes.includes(estado)) {
      throw new Error(`Transición no permitida: ${actual} → ${estado}`);
    }
    if (estado === "ready") {
      const errores = validarPreparacion(issue, porId);
      if (errores.length) throw new Error(errores.join("\n"));
    }
    if (estado === "done") {
      const errores = validarChecklist(issue.cuerpo, "Definition of Done", issue.frontmatter.id);
      if (errores.length) throw new Error(errores.join("\n"));
    }

    issue.frontmatter.status = estado;
    issue.frontmatter.updated_at = fechaISO(ahora);
    issue.cuerpo = `${issue.cuerpo.trimEnd()}\n- ${fechaISO(ahora)}: Estado cambiado de ${actual} a ${estado}.\n`;
    await escribirAtomico(issue.ruta, parsearFrontmatter(issue.frontmatter, issue.cuerpo));
    return issue;
  });
}

export async function asignarIssue(raiz, id, responsable, quitar = false, ahora = new Date()) {
  if (typeof responsable !== "string" || responsable.trim() === "") {
    throw new Error("Se requiere el nombre o identificador del responsable");
  }
  return conBloqueo(raiz, async () => {
    const issue = (await leerBacklogValido(raiz)).find((item) => item.frontmatter.id === id);
    if (!issue) throw new Error(`${id} no existe localmente`);
    const nombre = responsable.trim();
    const asignados = new Set(issue.frontmatter.assignees);
    if (quitar) asignados.delete(nombre);
    else asignados.add(nombre);
    issue.frontmatter.assignees = [...asignados];
    issue.frontmatter.updated_at = fechaISO(ahora);
    issue.cuerpo = `${issue.cuerpo.trimEnd()}\n- ${fechaISO(ahora)}: Responsable ${quitar ? "removido" : "asignado"}: ${nombre}.\n`;
    await escribirAtomico(issue.ruta, parsearFrontmatter(issue.frontmatter, issue.cuerpo));
    return issue;
  });
}

export async function archivarIssue(raiz, id, ahora = new Date()) {
  return conBloqueo(raiz, async () => {
    const issue = (await leerBacklogValido(raiz)).find((item) => item.frontmatter.id === id);
    if (!issue) throw new Error(`${id} no existe localmente`);
    if (issue.frontmatter.status !== "done") throw new Error("Solo se pueden archivar Issues con estado done");
    if (issue.ruta.includes(`${path.sep}archive${path.sep}`)) {
      throw new Error(`${id} ya está archivado`);
    }

    issue.frontmatter.updated_at = fechaISO(ahora);
    issue.cuerpo = `${issue.cuerpo.trimEnd()}\n- ${fechaISO(ahora)}: Issue archivado.\n`;
    await escribirAtomico(issue.ruta, parsearFrontmatter(issue.frontmatter, issue.cuerpo));
    const destino = path.join(rutaTasks(raiz), "archive", "closed", `${id}.md`);
    try {
      await fs.copyFile(issue.ruta, destino, fsConstants.COPYFILE_EXCL);
      await fs.rm(issue.ruta);
    } catch (error) {
      if (error.code !== "EEXIST") await fs.rm(destino, { force: true });
      throw error;
    }
    return { ...issue, ruta: destino };
  });
}

export async function registrarRevision(raiz, id, veredicto, hallazgos, ahora = new Date()) {
  const veredictos = ["APPROVED", "ITERATE", "DOES_NOT_MEET_REQUIREMENTS"];
  if (!veredictos.includes(veredicto)) {
    throw new Error(`Veredicto no permitido: ${veredicto}`);
  }
  if (!Array.isArray(hallazgos) || hallazgos.length === 0 || hallazgos.some((item) => !item.trim())) {
    throw new Error("La revisión requiere al menos un hallazgo o una nota explícita de que no hubo hallazgos");
  }
  return conBloqueo(raiz, async () => {
    const issue = (await leerBacklogValido(raiz)).find((item) => item.frontmatter.id === id);
    if (!issue) throw new Error(`${id} no existe localmente`);
    const fecha = fechaISO(ahora);
    issue.frontmatter.updated_at = fecha;
    const nota = `\n## Revisión local · ${fecha} · ${veredicto}\n${hallazgos.map((hallazgo) => `- ${hallazgo.trim()}`).join("\n")}\n`;
    issue.cuerpo = `${issue.cuerpo.trimEnd()}\n${nota}`;
    await escribirAtomico(issue.ruta, parsearFrontmatter(issue.frontmatter, issue.cuerpo));
    return issue;
  });
}

function detectarCiclos(issues) {
  const porId = new Map(issues.map((issue) => [issue.frontmatter.id, issue]));
  const visitando = new Set();
  const visitados = new Set();
  const ciclos = [];

  function visitar(id, camino) {
    if (visitando.has(id)) {
      ciclos.push(`${[...camino, id].join(" → ")}`);
      return;
    }
    if (visitados.has(id) || !porId.has(id)) return;
    visitando.add(id);
    const dependencias = porId.get(id).frontmatter.dependencies;
    for (const dependencia of Array.isArray(dependencias) ? dependencias : []) {
      visitar(dependencia, [...camino, id]);
    }
    visitando.delete(id);
    visitados.add(id);
  }

  for (const id of porId.keys()) visitar(id, []);
  return ciclos;
}

export async function validarBacklog(raiz = process.cwd()) {
  const issues = await leerTodos(raiz);
  const errores = issues.flatMap((issue) => issue.errores);
  const config = await leerConfig(raiz);
  const porId = new Map();
  let maximoId = 0;
  for (const issue of issues) {
    const id = issue.frontmatter.id;
    if (porId.has(id)) errores.push(`ID duplicado ${id}: ${path.relative(raiz, porId.get(id).ruta)} y ${path.relative(raiz, issue.ruta)}`);
    else porId.set(id, issue);
    const numeroId = typeof id === "string" ? id.match(PATRON_ID)?.[1] : undefined;
    if (numeroId) maximoId = Math.max(maximoId, Number(numeroId));
    if (issue.ruta.includes(`${path.sep}archive${path.sep}`) && issue.frontmatter.status !== "done") {
      errores.push(`${id}: un Issue archivado debe estar en estado done`);
    }
  }
  for (const issue of issues) {
    const id = issue.frontmatter.id;
    if (issue.frontmatter.status === "ready") {
      errores.push(...validarPreparacion(issue, porId));
    }
    if (issue.frontmatter.status === "done") {
      errores.push(...validarChecklist(issue.cuerpo, "Definition of Done", id));
    }
    const dependencias = issue.frontmatter.dependencies;
    for (const dependencia of Array.isArray(dependencias) ? dependencias : []) {
      if (!issues.some((candidato) => candidato.frontmatter.id === dependencia)) {
        errores.push(`${id}: dependencia inexistente ${dependencia}`);
      }
    }
  }
  if (config.nextIssueNumber <= maximoId) {
    errores.push(`nextIssueNumber debe ser mayor que el ID máximo existente (${maximoId})`);
  }
  for (const ciclo of detectarCiclos(issues)) errores.push(`Ciclo de dependencias: ${ciclo}`);
  return { issues, errores };
}

function estadoListable(issue, porId, soloListos) {
  if (!soloListos) return true;
  return issue.frontmatter.status === "ready" && validarPreparacion(issue, porId).length === 0;
}

export async function filtrarBacklog(raiz = process.cwd(), filtros = {}) {
  const { issues, errores } = await validarBacklog(raiz);
  if (errores.length) throw new Error(errores.join("\n"));
  const porId = new Map(issues.map((issue) => [issue.frontmatter.id, issue]));
  return issues.filter((issue) => {
    const dato = issue.frontmatter;
    return (!filtros.status || dato.status === filtros.status) &&
      (!filtros.priority || dato.priority === filtros.priority) &&
      (!filtros.assignee || dato.assignees.some((persona) => persona.toLowerCase() === filtros.assignee.toLowerCase())) &&
      (!filtros.blocked || dato.status === "blocked" || dependenciasPendientes(issue, porId).length > 0) &&
      estadoListable(issue, porId, filtros.ready === true);
  });
}

function analizarArgumentos(argumentos) {
  const posicionales = [];
  const opciones = {};
  for (let indice = 0; indice < argumentos.length; indice += 1) {
    const argumento = argumentos[indice];
    if (!argumento.startsWith("--")) {
      posicionales.push(argumento);
      continue;
    }
    const [nombre, inline] = argumento.slice(2).split("=", 2);
    if (["ready", "blocked"].includes(nombre) && inline === undefined) {
      opciones[nombre] = true;
      continue;
    }
    const valor = inline ?? argumentos[++indice];
    if (valor === undefined || valor.startsWith("--")) throw new Error(`Falta valor para --${nombre}`);
    if (nombre === "finding") {
      opciones[nombre] = [...(opciones[nombre] ?? []), valor];
    } else {
      opciones[nombre] = valor;
    }
  }
  return { posicionales, opciones };
}

function mostrarUso() {
  return `Uso:
  node scripts/tasks/issues.mjs create --title "..." --type feature [--priority medium] [--labels a,b] [--assignees nombre]
  node scripts/tasks/issues.mjs list [--status ready] [--assignee nombre] [--priority high] [--ready] [--blocked]
  node scripts/tasks/issues.mjs show ISSUE-001
  node scripts/tasks/issues.mjs status ISSUE-001 in_progress
  node scripts/tasks/issues.mjs assign ISSUE-001 nombre
  node scripts/tasks/issues.mjs unassign ISSUE-001 nombre
  node scripts/tasks/issues.mjs review ISSUE-001 ITERATE --finding "Hallazgo accionable"
  node scripts/tasks/issues.mjs archive ISSUE-001
  node scripts/tasks/issues.mjs check`;
}

async function ejecutar(raiz, comando, argumentos) {
  const { posicionales, opciones } = analizarArgumentos(argumentos);

  if (comando === "create") {
    const resultado = await crearIssue({
      raiz,
      title: opciones.title,
      type: opciones.type,
      priority: opciones.priority,
      labels: normalizarLista(opciones.labels),
      assignees: normalizarLista(opciones.assignees),
      due_date: opciones["due-date"] ?? null,
      milestone: opciones.milestone ?? null,
      related_issues: normalizarLista(opciones.related),
      dependencies: normalizarLista(opciones.dependencies),
      github_issue: opciones["github-issue"] === undefined ? null : Number(opciones["github-issue"]),
      description: opciones.description ?? "",
      context: opciones.context ?? "",
    });
    return `Creado ${resultado.id}: ${path.relative(raiz, resultado.ruta)}`;
  }

  if (comando === "show") {
    const id = posicionales[0];
    const issue = (await leerTodos(raiz)).find((item) => item.frontmatter.id === id);
    if (!issue) throw new Error(`${id ?? "Falta ID"} no existe localmente`);
    return await fs.readFile(issue.ruta, "utf8");
  }

  if (comando === "check") {
    const { issues, errores } = await validarBacklog(raiz);
    if (errores.length) throw new Error(errores.join("\n"));
    return `Backlog válido: ${issues.length} Issue(s), IDs únicos y dependencias consistentes.`;
  }

  if (comando === "status") {
    if (posicionales.length !== 2) throw new Error("Uso: status ISSUE-NNN ESTADO");
    const issue = await cambiarEstado(raiz, posicionales[0], posicionales[1]);
    return `${issue.frontmatter.id}: ${issue.frontmatter.status}`;
  }

  if (comando === "assign" || comando === "unassign") {
    if (posicionales.length !== 2) throw new Error(`Uso: ${comando} ISSUE-NNN RESPONSABLE`);
    const issue = await asignarIssue(raiz, posicionales[0], posicionales[1], comando === "unassign");
    return `${issue.frontmatter.id}: ${issue.frontmatter.assignees.join(", ") || "sin responsables"}`;
  }

  if (comando === "archive") {
    if (posicionales.length !== 1) throw new Error("Uso: archive ISSUE-NNN");
    const issue = await archivarIssue(raiz, posicionales[0]);
    return `Archivado ${issue.frontmatter.id}: ${path.relative(raiz, issue.ruta)}`;
  }

  if (comando === "review") {
    if (posicionales.length !== 2) throw new Error("Uso: review ISSUE-NNN VEREDICTO --finding texto");
    const issue = await registrarRevision(raiz, posicionales[0], posicionales[1], opciones.finding ?? []);
    return `${issue.frontmatter.id}: revisión local registrada`;
  }

  if (comando === "list") {
    const status = opciones.status;
    if (status && !ESTADOS.includes(status)) throw new Error(`Estado no permitido: ${status}`);
    const priority = opciones.priority;
    if (priority && !PRIORIDADES.includes(priority)) throw new Error(`Prioridad no permitida: ${priority}`);
    const items = await filtrarBacklog(raiz, {
      status,
      priority,
      assignee: opciones.assignee,
      blocked: opciones.blocked === true || opciones.blocked === "true",
      ready: opciones.ready === true || opciones.ready === "true",
    });
    const grupos = new Map(ORDEN_ESTADOS.map((estado) => [estado, []]));
    for (const item of items) grupos.get(item.frontmatter.status).push(item);
    const lineas = ["SPORTUES LOCAL BACKLOG"];
    for (const estado of ORDEN_ESTADOS) {
      const grupo = grupos.get(estado);
      if (!grupo.length) continue;
      lineas.push("", estado.replaceAll("_", " ").toUpperCase());
      for (const item of grupo) {
        const { id, title, priority: prioridad, assignees } = item.frontmatter;
        const responsable = assignees.length ? ` · ${assignees.join(", ")}` : "";
        lineas.push(`${id}  ${title}  ${prioridad.toUpperCase()}${responsable}`);
      }
    }
    if (!items.length) lineas.push("", "(sin Issues)");
    return lineas.join("\n");
  }

  throw new Error(`Comando desconocido: ${comando || "(vacío)"}\n\n${mostrarUso()}`);
}

async function main(argumentos) {
  try {
    const [comando, ...resto] = argumentos;
    if (!comando || comando === "--help" || comando === "-h") {
      process.stdout.write(`${mostrarUso()}\n`);
      return;
    }
    const salida = await ejecutar(process.cwd(), comando, resto);
    process.stdout.write(`${salida}\n`);
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
