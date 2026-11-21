# Issues locales de Sportues

`.tasks/` es la única fuente de verdad para administrar tareas. Los Issues son Markdown versionado con Git; no se necesita token, permiso de GitHub Issues/Projects ni acceso a sus APIs. GitHub sigue usándose para alojar el repositorio y revisar/mergear PRs, no para el backlog.

## Estructura

```text
.tasks/
├── README.md
├── config.json
├── issues/
│   ├── ISSUE-001.md
│   └── ISSUE-002.md
├── templates/
│   └── issue-template.md
└── archive/
    └── closed/
```

Cada Issue tiene YAML Frontmatter y secciones Markdown para descripción, contexto, criterios, DoR, DoD, plan, evidencias e historial. Los tipos permitidos son `feature`, `bug`, `task`, `documentation` y `research`; los estados son `backlog`, `ready`, `in_progress`, `in_review`, `done` y `blocked`; las prioridades son `low`, `medium`, `high` y `critical`.

El Frontmatter soporta `id`, `title`, `type`, `status`, `priority`, `labels`, `assignees`, `created_at`, `updated_at`, `due_date`, `milestone`, `related_issues`, `dependencies` y `github_issue`. `github_issue` es opcional, solo una referencia histórica, y nunca causa una llamada a GitHub. Se permiten propiedades futuras adicionales.

## Crear y consultar

Ejecuta estos comandos desde la raíz:

```bash
# Crear un Issue nuevo (se inicia en backlog y sin responsable)
node scripts/tasks/issues.mjs create --title "Agregar reporte semanal" --type feature --priority high

# Ver el Issue completo
node scripts/tasks/issues.mjs show ISSUE-001

# Consultar el backlog completo o filtrar
node scripts/tasks/issues.mjs list
node scripts/tasks/issues.mjs list --status ready
node scripts/tasks/issues.mjs list --assignee ana
node scripts/tasks/issues.mjs list --priority critical
node scripts/tasks/issues.mjs list --ready
node scripts/tasks/issues.mjs list --blocked

# Validar archivos, IDs, estados y dependencias
node scripts/tasks/issues.mjs check
```

`create` admite `--labels a,b`, `--assignees nombre`, `--due-date YYYY-MM-DD`, `--milestone M3`, `--related ISSUE-001`, `--dependencies ISSUE-001`, `--github-issue 38`, `--description "..."` y `--context "..."`. No completa datos que no se proporcionan.

Después de crear, completa los criterios y revisa DoR en el archivo. Asigna y cambia estado con comandos:

```bash
node scripts/tasks/issues.mjs assign ISSUE-002 ana
node scripts/tasks/issues.mjs status ISSUE-002 ready
node scripts/tasks/issues.mjs status ISSUE-002 in_progress
node scripts/tasks/issues.mjs status ISSUE-002 in_review
node scripts/tasks/issues.mjs unassign ISSUE-002 ana
```

Para entrar a `ready` se exigen criterios de aceptación no vacíos, todas las casillas de Definition of Ready marcadas, al menos un responsable y todas las dependencias en `done`. Para entrar a `done`, deben marcarse todas las casillas de Definition of Done; la persona responsable confirma además CI, merge y revisión humana antes de hacerlo. Las transiciones permitidas están en `config.json`.

`related_issues` sirve para referencias relacionadas; `dependencies` bloquea el paso a `ready` hasta que los Issues locales dependientes estén `done`. `list --ready` muestra los Issues `ready` que siguen cumpliendo esos requisitos; `list --blocked` identifica tanto estados `blocked` explícitos como dependencias aún pendientes. `check` detecta YAML inválido, campos requeridos inválidos, IDs duplicados, dependencias inexistentes y ciclos.

## Revisiones y archivo

El agente `revisor-pr` lee el Issue y el diff local y agrega hallazgos sin modificar código:

```bash
node scripts/tasks/issues.mjs review ISSUE-002 ITERATE --finding "Falta cubrir el caso límite"
node scripts/tasks/issues.mjs review ISSUE-002 APPROVED --finding "Sin hallazgos; verificación local documentada"
```

`APPROVED` es solo una recomendación local, nunca una aprobación formal de PR. Solo se archivan Issues `done`:

```bash
node scripts/tasks/issues.mjs archive ISSUE-002
```

El archivo se mueve a `archive/closed/` conservando su ID y contenido. No hay comando para borrar Issues. El contador de `config.json` es un registro permanente: no lo reduzcas ni reemplaces. Los escritores se serializan con `.tasks/.write.lock`; si una interrupción deja ese archivo, verifica primero que no haya proceso activo y luego elimínalo manualmente. `check` permite detectar conflictos de IDs tras integrar ramas.

El bloqueo protege procesos sobre el mismo checkout, no clones desconectados. Para evitar que dos ramas asignen el mismo siguiente número, crea los Issues sobre la rama compartida más reciente antes de abrir ramas de implementación; sincroniza el repo antes de cada creación. Si Git informa un conflicto en un archivo de Issue, coordina su resolución sin sobrescribir ni reutilizar un ID que ya fue distribuido.

Los cambios de contenido, evidencias y criterios se hacen en el archivo Markdown con revisión por Git. Los comandos `status`, `assign`, `unassign`, `review` y `archive` solo modifican campos controlados o añaden entradas al historial; no permiten cambiar criterios de aceptación.

## Migrar referencias anteriores

Los Issues existentes de GitHub no se borran, cierran ni modifican. Las referencias `#N` de documentos y evidencia conservan su significado histórico y no se convierten automáticamente en datos locales. Si el equipo migra uno:

1. Obtén su descripción y criterios de una fuente local versionada o de información que el equipo proporcione; este procedimiento no consulta la API.
2. Crea un Issue con el CLI e incluye `--github-issue N`.
3. Copia únicamente la información respaldada a las secciones locales.
4. Deja `assignees: []`, `due_date: null` u otros campos vacíos cuando no se conozcan; agrega `migration_status: pending` si faltan datos por triage y registra la limitación en Historial.
5. Inicia el estado local en `backlog` para triage; no presentes ese valor como el estado remoto recuperado.

No inventes fechas originales, responsables, criterios, estados ni cierres. Cada equipo puede migrar tareas distintas en archivos separados; evita editar un archivo común por tareas no relacionadas.

## Agentes

En Copilot Chat, invoca `implementador-issue` con un identificador local, por ejemplo `Implementa ISSUE-002`. El agente consulta el Issue local, valida que esté `ready`, solicita aprobación explícita del plan, crea una rama `feature/issue-002-...` o `bugfix/issue-002-...`, implementa, prueba y deja el estado en `in_review`. Nunca consulta GitHub Issues/Projects.

Invoca `revisor-pr` con el mismo ID para revisar diff, criterios y evidencias localmente. Registra el resultado en el Issue; no aprueba ni fusiona PRs. Consulta [las instrucciones de Copilot](../.github/copilot-instructions.md) y [el framework](../docs/framework.md).
