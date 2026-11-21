import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

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

export function detectarFallbacksJwt(texto: string): string[] {
  // Sólo sigue lecturas directas y aliases locales; no resuelve imports ni flujo dinámico.
  const archivo = ts.createSourceFile("jwt-secret.ts", texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaraciones = new Map<ts.Node, Map<string, ts.Expression | null>>();
  const hallazgos = new Set<string>();

  const desenvolver = (nodo: ts.Expression): ts.Expression => {
    while (
      ts.isParenthesizedExpression(nodo)
      || ts.isAsExpression(nodo)
      || ts.isTypeAssertionExpression(nodo)
      || ts.isNonNullExpression(nodo)
      || ts.isSatisfiesExpression(nodo)
    ) {
      nodo = nodo.expression;
    }
    return nodo;
  };

  const esLiteralStringNoVacio = (nodo: ts.Expression): boolean => {
    const expresion = desenvolver(nodo);
    return (ts.isStringLiteral(expresion) || ts.isNoSubstitutionTemplateLiteral(expresion))
      && expresion.text.trim() !== "";
  };

  const esAmbito = (nodo: ts.Node): boolean =>
    ts.isSourceFile(nodo)
    || ts.isBlock(nodo)
    || ts.isModuleBlock(nodo)
    || ts.isFunctionLike(nodo)
    || ts.isCatchClause(nodo)
    || ts.isForStatement(nodo)
    || ts.isForInStatement(nodo)
    || ts.isForOfStatement(nodo);

  const obtenerAmbito = (nodo: ts.Node): ts.Node => {
    let actual: ts.Node | undefined = nodo;
    while (actual && !esAmbito(actual)) actual = actual.parent;
    return actual ?? archivo;
  };

  const registrarDeclaracion = (nodo: ts.Node, nombre: string, inicializador: ts.Expression | null): void => {
    const ambito = obtenerAmbito(nodo);
    const declaracionesAmbito = declaraciones.get(ambito) ?? new Map<string, ts.Expression | null>();
    declaracionesAmbito.set(nombre, inicializador);
    declaraciones.set(ambito, declaracionesAmbito);
  };

  const buscarDeclaracion = (referencia: ts.Identifier): ts.Expression | null | undefined => {
    let ambito: ts.Node | undefined = obtenerAmbito(referencia);
    while (ambito) {
      const declaracionesAmbito = declaraciones.get(ambito);
      if (declaracionesAmbito?.has(referencia.text)) return declaracionesAmbito.get(referencia.text);
      ambito = ambito.parent ? obtenerAmbito(ambito.parent) : undefined;
      if (ambito === archivo && !declaraciones.has(archivo)) break;
    }
    return undefined;
  };

  const esLecturaJwt = (expresion: ts.Expression): boolean => {
    const nodo = desenvolver(expresion);
    if (
      ts.isElementAccessExpression(nodo)
      && (ts.isStringLiteral(nodo.argumentExpression)
        || ts.isNoSubstitutionTemplateLiteral(nodo.argumentExpression))
      && nodo.argumentExpression.text === "JWT_SECRET"
      && ts.isPropertyAccessExpression(nodo.expression)
      && nodo.expression.name.text === "env"
      && ts.isIdentifier(nodo.expression.expression)
      && nodo.expression.expression.text === "process"
    ) {
      return true;
    }
    if (
      ts.isPropertyAccessExpression(nodo)
      && nodo.name.text === "JWT_SECRET"
      && ts.isPropertyAccessExpression(nodo.expression)
      && nodo.expression.name.text === "env"
      && ts.isIdentifier(nodo.expression.expression)
      && nodo.expression.expression.text === "process"
    ) {
      return true;
    }
    if (!ts.isCallExpression(nodo) || nodo.arguments.length === 0) return false;

    const metodo = ts.isPropertyAccessExpression(nodo.expression) ? nodo.expression.name.text : "";
    const primerArgumento = nodo.arguments[0];
    return metodo === "get"
      && (ts.isStringLiteral(primerArgumento) || ts.isNoSubstitutionTemplateLiteral(primerArgumento))
      && primerArgumento.text === "JWT_SECRET";
  };

  const resolverReferencia = (
    expresion: ts.Expression,
    resolverValor: (valor: ts.Expression) => boolean,
    visitar = new Set<ts.Node>(),
  ): boolean => {
    const nodo = desenvolver(expresion);
    if (resolverValor(nodo)) return true;
    if (!ts.isIdentifier(nodo)) return false;

    const declaracion = buscarDeclaracion(nodo);
    if (!declaracion || visitar.has(declaracion)) return false;
    visitar.add(declaracion);
    return resolverReferencia(declaracion, resolverValor, visitar);
  };

  const esReferenciaSecreto = (expresion: ts.Expression): boolean =>
    resolverReferencia(expresion, esLecturaJwt);

  const esValorAlternativo = (expresion: ts.Expression): boolean =>
    resolverReferencia(expresion, esLiteralStringNoVacio);

  const recolectarDeclaraciones = (nodo: ts.Node): void => {
    if (ts.isVariableDeclaration(nodo) && ts.isIdentifier(nodo.name) && nodo.initializer) {
      registrarDeclaracion(nodo, nodo.name.text, nodo.initializer);
    } else if (ts.isVariableDeclaration(nodo) && ts.isIdentifier(nodo.name)) {
      registrarDeclaracion(nodo, nodo.name.text, null);
    }
    if (ts.isParameter(nodo) && ts.isIdentifier(nodo.name)) {
      registrarDeclaracion(nodo, nodo.name.text, nodo.initializer ?? null);
    }
    nodo.forEachChild(recolectarDeclaraciones);
  };
  recolectarDeclaraciones(archivo);

  const inspeccionar = (nodo: ts.Node): void => {
    if (
      ts.isBinaryExpression(nodo)
      && (nodo.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
        || nodo.operatorToken.kind === ts.SyntaxKind.BarBarToken)
      && esReferenciaSecreto(nodo.left)
      && esValorAlternativo(nodo.right)
    ) {
      const linea = archivo.getLineAndCharacterOfPosition(nodo.getStart(archivo)).line + 1;
      hallazgos.add(`línea ${linea}: fallback JWT_SECRET con valor alternativo no vacío`);
    }
    nodo.forEachChild(inspeccionar);
  };
  inspeccionar(archivo);

  return [...hallazgos].sort();
}

describe("guardrail de secretos JWT", () => {
  it("detecta un fallback literal con ??", () => {
    const codigo = 'const secreto = process.env.JWT_SECRET ?? "un-secreto-conocido";';
    expect(detectarFallbacksJwt(codigo)).not.toEqual([]);
  });

  it("detecta fallback literal multilinea con ??", () => {
    const codigo = [
      "const secreto = process.env.JWT_SECRET",
      '  ?? "un-secreto-conocido";',
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).not.toEqual([]);
  });

  it("detecta un fallback literal con ||", () => {
    const codigo = 'const secreto = process.env.JWT_SECRET || "dev-secret";';
    expect(detectarFallbacksJwt(codigo)).not.toEqual([]);
  });

  it("detecta fallback literal multilinea con ||", () => {
    const codigo = [
      'const secreto = config.get("JWT_SECRET")',
      '  || `secreto-conocido`;',
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).not.toEqual([]);
  });

  it("detecta ConfigService con un fallback literal", () => {
    const codigo = 'const secreto = config.get("JWT_SECRET") ?? "clave-conocida";';
    expect(detectarFallbacksJwt(codigo)).not.toEqual([]);
  });

  it.each(["JWT_FALLBACK", "DEFAULT_SECRET", "fallback"])(
    "detecta la constante %s cuando se usa como valor alternativo",
    (nombre) => {
      const codigo = [
        `const ${nombre} = "cambio-esto-en-produccion";`,
        `const secreto = process.env.JWT_SECRET ?? ${nombre};`,
      ].join("\n");
      expect(detectarFallbacksJwt(codigo)).toEqual([
        "línea 2: fallback JWT_SECRET con valor alternativo no vacío",
      ]);
    },
  );

  it("detecta una constante de respaldo en español usada con ||", () => {
    const codigo = [
      'const SECRETO_JWT_RESPALDO = "secreto-local";',
      "const secreto = config.get('JWT_SECRET') || SECRETO_JWT_RESPALDO;",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([
      "línea 2: fallback JWT_SECRET con valor alternativo no vacío",
    ]);
  });

  it.each([
    ["??", "const secreto = config.get('JWT_SECRET'); return secreto ?? DEFAULT_SECRET;"],
    ["||", "const secreto = config.get('JWT_SECRET'); return secreto || DEFAULT_SECRET;"],
  ])("detecta un alias local usado con %s", (_operador, expresion) => {
    const codigo = [
      'const DEFAULT_SECRET = "secreto-local";',
      `function crearToken() { ${expresion} }`,
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([
      "línea 2: fallback JWT_SECRET con valor alternativo no vacío",
    ]);
  });

  it("detecta alias de process.env.JWT_SECRET usado con ||", () => {
    const codigo = [
      'const DEFAULT_SECRET = "secreto-local";',
      "function crearToken() {",
      "  const secreto = process.env.JWT_SECRET;",
      "  return secreto || DEFAULT_SECRET;",
      "}",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([
      "línea 4: fallback JWT_SECRET con valor alternativo no vacío",
    ]);
  });

  it("detecta alias de process.env.JWT_SECRET usado con ?? en varias líneas", () => {
    const codigo = [
      'const DEFAULT_SECRET = "secreto-local";',
      "function crearToken() {",
      "  const secreto = process.env.JWT_SECRET;",
      "  return secreto",
      "    ?? DEFAULT_SECRET;",
      "}",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([
      "línea 4: fallback JWT_SECRET con valor alternativo no vacío",
    ]);
  });

  it("detecta un alias local multilinea para JWT_SECRET", () => {
    const codigo = [
      'const secreto = config.get("JWT_SECRET");',
      "const token = secreto",
      "  ?? DEFAULT_SECRET;",
      'const DEFAULT_SECRET = "secreto-local";',
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([
      "línea 2: fallback JWT_SECRET con valor alternativo no vacío",
    ]);
  });

  it("no confunde la ausencia de secreto con un fallback", () => {
    const codigo = [
      'const secreto = process.env.JWT_SECRET;',
      'if (!secreto || secreto.trim() === "") throw new Error("JWT_SECRET no está definido");',
      'return secreto;',
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([]);
  });

  it("no confunde la validación multilinea de JWT_SECRET con un fallback", () => {
    const codigo = [
      "if (!process.env.JWT_SECRET",
      '  || process.env.JWT_SECRET.trim() === "") {',
      '  throw new Error("JWT_SECRET no está definido");',
      "}",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([]);
  });

  it("no marca una expresión con jwtSecret si el literal no es su valor alternativo", () => {
    const codigo = [
      'const jwtSecret = process.env.JWT_SECRET;',
      'const mensaje = jwtSecret === "" || "JWT_SECRET no está configurado";',
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([]);
  });

  it("no marca una constante de respaldo que no se usa como alternativa", () => {
    const codigo = [
      'const DEFAULT_SECRET = "secreto-local";',
      "const secreto = process.env.JWT_SECRET;",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([]);
  });

  it("respeta el sombreado de una constante por un parámetro de otro ámbito", () => {
    const codigo = [
      'const fallback = "secreto-local";',
      "function validar(jwtSecret: string, fallback: boolean) {",
      "  return jwtSecret || fallback;",
      "}",
    ].join("\n");
    expect(detectarFallbacksJwt(codigo)).toEqual([]);
  });

  it("acepta los helpers actuales correctos de API, Admin y Web", () => {
    for (const base of ["apps", "packages"]) {
      for (const archivo of archivosFuente(join(raiz, base))) {
        expect(detectarFallbacksJwt(readFileSync(archivo, "utf8")), archivo).toEqual([]);
      }
    }
  });

  it("no encuentra fallbacks literales conocidos en archivos fuente", () => {
    for (const base of ["apps", "packages"]) {
      for (const archivo of archivosFuente(join(raiz, base))) {
        const contenido = readFileSync(archivo, "utf8");
        expect(/dev-secret/i.test(contenido), archivo).toBe(false);
      }
    }
  });
});
