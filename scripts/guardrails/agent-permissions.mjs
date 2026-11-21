import fs from "node:fs";
import { parse } from "yaml";

const RUTA_MANIFEST = ".github/agent-permissions.json";

export function cargarManifestAgentes() {
  return JSON.parse(fs.readFileSync(RUTA_MANIFEST, "utf8"));
}

export function analizarAgente(ruta) {
  const contenido = fs.readFileSync(ruta, "utf8");
  const coincidencia = contenido.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  let metadata = {};
  try {
    metadata = parse(coincidencia) ?? {};
  } catch {
    metadata = {};
  }

  const herramientas = typeof metadata.tools === "string"
    ? metadata.tools.split(",").map((herramienta) => herramienta.trim()).filter(Boolean)
    : Array.isArray(metadata.tools)
      ? metadata.tools
      : [];

  return {
    contenido,
    metadata,
    herramientas,
  };
}

function contieneOperacionMutativa(contenido) {
  const prohibidas = [
    /\bgit\s+(?:add|commit|push|merge|switch|checkout|branch|rebase|reset|cherry-pick)\b/i,
    /\bgh\s+(?:issue|project)\b/i,
    /\bgh\s+(?:pr\s+(?:create|review|merge|close)|api|repo|release)\b/i,
    /\bgh\s+pr\s+comment\b/i,
    /\b(?:curl|wget)\b/i,
    /\b(?:bash|sh|zsh|node|python|python3|ruby|perl|php|npx|npm\s+exec)\b/i,
    /\b(?:mutation)\b/i,
    /(?:pulls\/[^/\s]+\/(?:merge|reviews)|repos\/[^/\s]+\/[^/\s]+\/discussions)/i,
    /(?:--approve|--request-changes|--merge|APPROVE|REQUEST_CHANGES)/i,
    /\b(?:alias|source|eval)\b/i,
  ];

  return contenido.split("\n").some((linea) => {
    if (comandoIssueLocalPermitido(linea)) return false;
    if (crearRamaIssuePermitida(linea)) return false;
    const ejecutable = /^(?:git|gh|curl|wget|bash|sh|zsh|node|python|python3|ruby|perl|php|npx|npm\s+exec|env|command|alias|source|sudo|doas|xargs)\b/i.test(linea.trim());
    return ejecutable && prohibidas.some((patron) => patron.test(linea));
  });
}

function crearRamaIssuePermitida(linea) {
  return /^git switch -c (?:feature|bugfix)\/issue-\d{3,}-[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(linea.trim());
}

function comandoIssueLocalPermitido(linea) {
  const comando = linea.trim();
  return /^node scripts\/tasks\/issues\.mjs (?:list(?: --ready)?|show ISSUE-\d{3,}|status ISSUE-\d{3,} (?:in_progress|in_review)|review ISSUE-\d{3,} (?:APPROVED|ITERATE|DOES_NOT_MEET_REQUIREMENTS) --finding "[^"$`;&|<>]+")$/.test(comando);
}

function contieneExpansionShell(contenido) {
  return contenido.split("\n").some((linea) => {
    if (comandoIssueLocalPermitido(linea)) return false;
    if (crearRamaIssuePermitida(linea)) return false;
    const ejecutable = /^(?:git|gh|curl|wget|bash|sh|zsh|node|python|python3|ruby|perl|php|npx|npm\s+exec|env|command|alias|source|sudo|doas|xargs)\b/i.test(linea.trim());
    if (!ejecutable) return false;
    return linea.includes("&&") ||
      linea.includes("||") ||
      linea.includes(";") ||
      linea.includes("|") ||
      linea.includes("`") ||
      linea.includes("$(") ||
      linea.includes("${") ||
      linea.includes("<(") ||
      linea.includes(">(");
  });
}

export function validarAgenteImplementacion(ruta) {
  const manifest = cargarManifestAgentes();
  const { contenido, metadata, herramientas } = analizarAgente(ruta);
  const errores = [];

  if (typeof metadata.name !== "string" || metadata.name !== "implementador-issue") {
    errores.push("El agente debe tener name: implementador-issue.");
  }
  if (metadata["strict-tools-list"] !== true) {
    errores.push("El agente debe declarar strict-tools-list: true.");
  }
  if (metadata["include-custom-instructions"] !== true) {
    errores.push("El agente debe declarar include-custom-instructions: true.");
  }
  if (herramientas.join("|") !== manifest.implementation.allowedTools.join("|")) {
    errores.push("Las herramientas del implementador no coinciden exactamente con el manifiesto.");
  }
  if (!herramientas.includes("execute")) {
    errores.push("El implementador debe declarar execute para pruebas y lecturas locales.");
  }
  if (!/aprobación humana explícita|¿Apruebas este plan antes de implementar\?/i.test(contenido)) {
    errores.push("El implementador no exige aprobación humana explícita del plan.");
  }
  if (!/Nunca crees, apruebes, cierres o fusiones un PR|Nunca uses `git add`/i.test(contenido)) {
    errores.push("El implementador no declara los límites mutativos obligatorios.");
  }
  if (contieneExpansionShell(contenido)) {
    errores.push("El agente contiene constructos de expansión de shell.");
  }
  if (contieneOperacionMutativa(contenido)) {
    errores.push("El agente contiene una operación Git, GitHub, HTTP o intérprete prohibida.");
  }
  for (const operacion of manifest.implementation.allowedShellCommands) {
    if (!contenido.includes(operacion)) {
      errores.push(`Falta la operación Shell permitida: ${operacion}.`);
    }
  }
  if (!/restricciones estáticas|no constituyen una sandbox|guardrails/i.test(contenido)) {
    errores.push("El agente debe declarar honestamente que las restricciones no son una sandbox.");
  }

  return errores;
}

export function validarAgenteRevision(ruta) {
  const manifest = cargarManifestAgentes();
  const { contenido, metadata, herramientas } = analizarAgente(ruta);
  const errores = [];

  if (typeof metadata.name !== "string" || metadata.name !== "revisor-pr") {
    errores.push("El agente debe tener name: revisor-pr.");
  }
  if (metadata["strict-tools-list"] !== true) {
    errores.push("El revisor debe declarar strict-tools-list: true.");
  }
  if (metadata["include-custom-instructions"] !== true) {
    errores.push("El revisor debe declarar include-custom-instructions: true.");
  }
  if (herramientas.join("|") !== manifest.review.allowedTools.join("|")) {
    errores.push("Las herramientas del revisor no coinciden exactamente con el manifiesto.");
  }
  if (herramientas.some((herramienta) => ["edit", "write"].includes(herramienta))) {
    errores.push("El revisor no puede editar archivos directamente.");
  }
  if (!herramientas.includes("execute")) {
    errores.push("El revisor necesita execute para registrar hallazgos mediante el CLI local.");
  }
  if (!/aprobar|aprueba|aprobación|nunca apruebes|no apruebes/i.test(contenido)) {
    errores.push("El revisor debe prohibir aprobación automática.");
  }
  if (!/fusionar|fusiones|merge|fusión/i.test(contenido)) {
    errores.push("El revisor debe prohibir merge.");
  }
  if (!/No puedes editar archivos|No puedes publicar comentarios|No puedes|No edites código ni archivos directamente/i.test(contenido)) {
    errores.push("El revisor debe declararse solo lectura y sin publicación.");
  }
  if (!/restricciones estáticas|no constituyen una sandbox/i.test(contenido)) {
    errores.push("El revisor debe declarar honestamente la limitación estática.");
  }
  if (contieneExpansionShell(contenido) || contieneOperacionMutativa(contenido)) {
    errores.push("El revisor contiene una operación de ejecución o GitHub mutativa.");
  }
  for (const operacion of manifest.review.allowedShellCommands) {
    if (!contenido.includes(operacion)) {
      errores.push(`Falta la operación Shell de lectura requerida: ${operacion}.`);
    }
  }

  return errores;
}

export function validarMigracionCopilot() {
  const errores = [];
  const agentes = [
    ".github/agents/implementador-issue.agent.md",
    ".github/agents/revisor-pr.agent.md",
  ];

  for (const ruta of agentes) {
    if (!fs.existsSync(ruta)) errores.push(`Falta el agente nativo: ${ruta}.`);
  }
  if (fs.existsSync(".claude/commands/implementar-issue.md") ||
      fs.existsSync(".claude/commands/revisar-pr.md") ||
      fs.existsSync(".claude/agents/reviewer.md")) {
    errores.push("Todavía existen archivos operativos de Claude para la tarea #10.");
  }

  return errores;
}
