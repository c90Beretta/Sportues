import fs from "node:fs";
import { parse } from "yaml";

const RUTA_MANIFEST = ".github/agent-permissions.json";

function cargarManifest() {
  return JSON.parse(fs.readFileSync(RUTA_MANIFEST, "utf8"));
}

export function analizarComandoAgente(ruta) {
  const contenido = fs.readFileSync(ruta, "utf8");
  const coincidencia = contenido.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  let metadata = {};
  try {
    metadata = parse(coincidencia) ?? {};
  } catch {
    metadata = {};
  }

  const herramientas = typeof metadata["allowed-tools"] === "string"
    ? metadata["allowed-tools"].split(",").map((herramienta) => herramienta.trim()).filter(Boolean)
    : [];

  return {
    contenido,
    descripcion: typeof metadata.description === "string" ? metadata.description : "",
    herramientas,
  };
}

function esLineaEjecutable(linea) {
  const limpia = linea.trim().replace(/^[-+]\s*/, "");
  if (/^(?:Nunca|No |Está prohibido|prohibido|No hagas|Después de|Detente|Trabaja|Presenta|Usa)/i.test(limpia)) {
    return false;
  }
  if (/^(?:Ejecuta|ejecuta)\s*:/i.test(limpia)) return true;
  return /^(?:git|gh|curl|wget|bash|sh|zsh|node|python|python3|ruby|perl|php|npx|npm\s+exec|env|command|alias|source|\.\s|sudo|doas|xargs)\b/i.test(limpia);
}

function contieneExpansionShell(contenido) {
  return contenido.split("\n").some((linea) => {
    const ejecutable = esLineaEjecutable(linea);
    if (!ejecutable && !/\$\(|\$\{/.test(linea)) {
      return false;
    }
    return /(?:&&|\|\||;|\||`|\$\(|\$\{|<\(|>\(|\\\n)/.test(linea);
  });
}

function contieneMutacionEjecutable(contenido) {
  const prohibidas = [
    /\bgit\s+(?:add|commit|push|merge|switch|checkout|branch|rebase|reset|cherry-pick)\b/i,
    /\bgh\s+(?:pr\s+(?:create|review|merge)|api|repo|release)\b/i,
    /\bgh\s+pr\s+comment\b/i,
    /\b(?:curl|wget)\b/i,
    /\b(?:bash|sh|zsh|node|python|python3|ruby|perl|php|npx|npm\s+exec)\b/i,
    /\b(?:mutation)\b/i,
    /(?:pulls\/[^/\s]+\/(?:merge|reviews)|repos\/[^/\s]+\/[^/\s]+\/discussions)/i,
    /(?:--approve|--request-changes|--merge|APPROVE|REQUEST_CHANGES)/i,
    /\b(?:alias|source|eval)\b/i,
    /\b(?:env|sudo|doas|xargs)\b.*\b(?:git|gh|curl|wget|node|python|bash|sh)\b/i,
  ];

  return contenido.split("\n").some((linea) =>
    esLineaEjecutable(linea) &&
    !/^(?:##|#|\s*\*)/.test(linea.trim()) &&
    prohibidas.some((patron) => patron.test(linea)),
  );
}

export function validarComandoImplementacion(ruta) {
  const { contenido, herramientas } = analizarComandoAgente(ruta);
  const manifest = cargarManifest();
  const errores = [];
  const plan = contenido.search(/^## Fase 1: planificación obligatoria$/m);
  const gate = contenido.search(/PUERTA HUMANA OBLIGATORIA:/i);
  const implementacion = contenido.search(/^## Fase 2: implementación solo después de aprobar$/m);

  if (plan < 0 || gate < 0 || implementacion < 0 || !(plan < gate && gate < implementacion)) {
    errores.push("El plan debe preceder a una puerta humana explícita y a la implementación.");
  }
  if (!/aprobación humana explícita|nombre el plan aprobado|no hay una respuesta explícita/i.test(contenido)) {
    errores.push("La puerta humana no exige aprobación explícita del plan mostrado.");
  }
  if (contieneExpansionShell(contenido)) {
    errores.push("El comando contiene constructos de expansión de shell.");
  }
  if (contieneMutacionEjecutable(contenido)) {
    errores.push("El comando contiene una operación Git, GitHub o intérprete prohibida.");
  }

  const permitidas = new Set([
    ...manifest.implementation.allowedTools,
    ...manifest.implementation.allowedBash,
  ]);
  if (herramientas.some((herramienta) => !permitidas.has(herramienta))) {
    errores.push("El frontmatter contiene herramientas fuera del manifiesto de implementación.");
  }
  if (herramientas.some((herramienta) =>
    /^Bash\((?:git (?:add|commit|push|merge|switch|checkout|branch|rebase|reset)|gh (?:pr (?:create|review|merge)|api)|curl |wget |bash |sh |zsh |node |python|ruby |npx )/i.test(herramienta),
  )) {
    errores.push("El Bash de implementación incluye una operación prohibida.");
  }
  for (const permiso of manifest.implementation.allowedBash) {
    if (!herramientas.includes(permiso)) {
      errores.push(`Falta el permiso Bash requerido: ${permiso}.`);
    }
  }

  return errores;
}

export function validarComandoRevision(ruta) {
  const { contenido, herramientas } = analizarComandoAgente(ruta);
  const manifest = cargarManifest();
  const errores = [];

  if (herramientas.some((herramienta) => /^(?:Write|Edit)$/.test(herramienta))) {
    errores.push("El revisor no debe tener herramientas de escritura.");
  }
  if (!/comentarios generales o sugerencias/i.test(contenido)) {
    errores.push("El revisor debe limitar su salida a comentarios o sugerencias nuevos.");
  }

  for (const opcion of manifest.review.forbiddenCommentOptions) {
    if (!contenido.includes(opcion)) {
      errores.push(`El revisor no declara prohibida la opción ${opcion}.`);
    }
  }

  if (contieneExpansionShell(contenido)) {
    errores.push("El revisor contiene constructos de expansión de shell.");
  }
  if (contieneMutacionEjecutable(contenido)) {
    errores.push("El revisor contiene una operación Git, GitHub, HTTP o intérprete prohibida.");
  }

  const permitidas = new Set([
    ...manifest.review.allowedTools,
    ...manifest.review.allowedBash,
  ]);
  if (herramientas.some((herramienta) => !permitidas.has(herramienta))) {
    errores.push("El frontmatter contiene herramientas fuera del manifiesto de revisión.");
  }
  for (const permiso of manifest.review.allowedBash) {
    if (!herramientas.includes(permiso)) {
      errores.push(`Falta el permiso Bash requerido: ${permiso}.`);
    }
  }
  if (herramientas.some((herramienta) => /^Bash\(gh pr comment/i.test(herramienta))) {
    errores.push("El revisor no debe recibir permiso para gh pr comment; los comentarios se publican manualmente.");
  }

  for (const opcion of ["--edit-last", "--delete-last", "--edit", "--delete", "--create-if-none", "--web"]) {
    const coincidencia = new RegExp(`gh\\s+pr\\s+comment[^\\n]*${opcion.replace("-", "\\-")}`, "i");
    if (coincidencia.test(contenido)) {
      errores.push(`El revisor intenta usar la opción prohibida ${opcion}.`);
    }
  }

  return errores;
}
