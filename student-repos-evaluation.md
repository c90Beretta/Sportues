# Student Repos — Evaluation

> Repos where students sent an invitation (collaborator access) in the last 2 weeks.
> Use this file to review and grade each project.

| #   | Repository                                                                                        | Student (owner)    | Collaborators (write)                                          | Created | Last push | Frontend             | Backend                | Frameworks                            | Review status | Score    | Notes |
| --- | ------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- | ------- | --------- | -------------------- | ---------------------- | ------------------------------------- | ------------- | -------- | ----- |
| 1   | [VickySCG01/LinkUES](https://github.com/VickySCG01/LinkUES)                                       | VickySCG01         | DaJoJo10, ByShonen, rome3ro                                    | Aug 29  | Sep 6     | Next.js (single app) | Next.js + Prisma       | Next.js, Prisma, PostgreSQL 16        | ✅ Reviewed   | **79/100** | Proposal submitted; direct pushes to main; no pair-log |
| 2   | [jovani420/MarketUES](https://github.com/jovani420/MarketUES)                                     | jovani420          | Maackyy, gaelneveros1-png, Jesus-Ruiz-DB, rome3ro              | Aug 29  | Sep 4     | React (Vite)         | Python FastAPI         | FastAPI + React + **MySQL**           | ✅ Reviewed   | **45/100** | No proposal; MySQL instead of PostgreSQL; inline pip installs |
| 3   | [c90Beretta/Sportues](https://github.com/c90Beretta/Sportues)                                     | c90Beretta         | JoseNoperi, PaulinoSeg, d4gsoj890, rome3ro                     | Aug 30  | Sep 7     | Next.js admin + Astro public | NestJS API          | NestJS + Next.js + Astro, PostgreSQL 16 | ✅ Reviewed   | **43/100** | All 6 commits by one partner; no proposal; zero PRs |
| 4   | [MarcoST2049/REPOGradUES](https://github.com/MarcoST2049/REPOGradUES)                             | MarcoST2049        | carlos270698, GabrielDLCC, rome3ro                             | Aug 30  | Sep 6     | — (empty Front/)     | — (empty Back/)        | .NET + Node.js (template only)        | ✅ Reviewed   | **36/100** | Empty skeleton; MSSQL; no proposal; partner 0 commits |
| 5   | [SaraCarmona03/VozUniversitaria](https://github.com/SaraCarmona03/VozUniversitaria)               | SaraCarmona03      | Vanesa03333, JesusManuelNoriegaVelazquez, chhah1020, dianabazaneUES, rome3ro | Aug 30 | Sep 6 | ASP.NET MVC views    | ASP.NET Core MVC       | .NET MVC + **MSSQL**                  | ✅ Reviewed   | **45/100** | No proposal; MSSQL; bin/obj committed |
| 6   | [PrometheusAgnostic/proyecto-cafeteria](https://github.com/PrometheusAgnostic/proyecto-cafeteria) | PrometheusAgnostic | NoeVladimir, Tenkeii, rome3ro                                  | Sep 3   | Sep 7     | Vue                  | Java Spring Boot (Maven) | Spring Boot + Vue, PostgreSQL 16     | ✅ Reviewed   | **86/100** | Best repo: full proposal, pair-log, templates actually used |
| 7   | [DessRod11/UESPORT](https://github.com/DessRod11/UESPORT)                                         | DessRod11          | Karenpcruz, rome3ro                                            | Sep 3   | Sep 6     | Vue 3 + Vite + Tailwind | Python FastAPI        | FastAPI + Vue, PostgreSQL 15          | ✅ Reviewed   | **47/100** | No proposal; partner 0 commits; template files exist but empty |
| 8   | [karlisnu/EduMatch](https://github.com/karlisnu/EduMatch)                                         | karlisnu           | JuliCnnr, LupitaBurboa, rome3ro                                | Sep 5   | Sep 5     | HTML/CSS/JS (static) | — (none yet)           | Static prototype; .NET/MSSQL devcontainer | ✅ Reviewed | **37/100** | No proposal; no .github at all; partners 0 commits |
| 9   | [Laprapvk/university-health-container](https://github.com/Laprapvk/university-health-container)   | Laprapvk           | rome3ro (no partner added)                                     | Sep 6   | Sep 6     | React 19 + Vite + Tailwind | Python FastAPI      | FastAPI + React, PostgreSQL 16 + Redis | ✅ Reviewed   | **37/100** | No partner added; no proposal; no workflow |

## Review status legend

- ⬜ Not started
- 🔄 In progress
- ✅ Reviewed

## Scoring rubric (100 points)

All 9 repos reviewed sequentially on Sep 9, 2026, against the [Week 1 Review Guidelines](../docs/week1-review-guidelines.md).

| # | Criterion | Points | What earns full credit |
| - | --------- | ------ | ---------------------- |
| 1 | Environment setup | 10 | Docker + Dev Containers + Git/SSH working (local tools verified by students' own evidence; SSH unverifiable remotely) |
| 2 | Shared repository | 15 | Private (5) · naming `<course>-<yourapp>` (3) · both partners with write access (4) · SSH clone evidence (3) |
| 3 | Dev container | 20 | devcontainer.json configured (5) · compose with app + PostgreSQL (5) · dependencies install automatically (5) · pinned/reproducible images (5) |
| 4 | GitHub workflow | 20 | `main` protected: PR + 1 approval + CI (8) · PR template (4) · issue templates (4) · Projects board (4) |
| 5 | Project proposal | 20 | `Project Proposal` issue by Sep 8 (5) · Appendix E template (5) · primary entity 6+ fields (4) · related entity 1:N (3) · 30-second problem statement (3) |
| 6 | Pair working | 15 | `docs/pair-log.md` with first entry (5) · both partners committed (5) · ≥30% of commits from each (5) |

**Consistency rules (applied identically to every repo):**

- Items that cannot be verified remotely (Projects board, SSH clone, local machine tools) score **0** and are marked *unverified* — never assumed.
- Direct pushes to `main` found → partial branch-protection credit (**4/8**); none of the 9 repos showed evidence of enforcement.
- Naming is strictly `<course>-<yourapp>`; a course suffix without a prefix (e.g. `LinkUES`, `UESPORT`, `EduMatch`) scores **1/3**.
- Wrong database (MySQL/MSSQL instead of PostgreSQL) → **3/5** on the compose criterion.
- Dependencies installed inline (`pip install …` / `npm install` in `postCreateCommand`) instead of from declared dependency files → **3/5** on auto-install; declared files present but no install step at all → also **3/5**.
- `latest` image tags → **3/5** on reproducibility.
- Template files that exist but are empty (0 bytes) → **2/4** (present but unusable).
- Partner with 0 commits → **0/15** on pair working; partner below 30% of commits → **3/5** on the distribution sub-criterion.

## Evaluation notes

### VickySCG01/LinkUES — 79/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 20/20 | 12/20 | 20/20 | 8/15 | **79** |

- Single Next.js + Prisma app; 7 commits — DaJoJo10 5 (71%), VickySCG01 2 (28.6%).
- **Issue #4 "Project Proposal"** (OPEN, Sep 6): full Appendix E content — JobPosting with 12 fields, Application as 1:N related entity, clear 30-second problem statement → 20/20.
- Strongest container of the cohort: `compose.yaml` with app + `postgres:16-bookworm` (healthcheck), `post-create.sh` runs `npm ci`, Prisma generate/migrate/seed → 20/20.
- `.github` has a PR template and `ISSUE_TEMPLATE/`; PRs #1 and #2 merged through the PR flow.
- **Issues:** two direct pushes to `main` (4/8 branch protection); no `docs/pair-log.md`; VickySCG01 below 30% (3/5 distribution); naming `LinkUES` lacks course prefix (1/3); SSH unverified.

### jovani420/MarketUES — 45/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 14/20 | 4/20 | 0/20 | 8/15 | **45** |

- Monorepo `backend/` (FastAPI) + `frontend/` (React/Vite); 4 commits — jovani420 3 (75%), Maackyy 1 (25%).
- PR #1 merged via PR flow, but two direct pushes to `main`.
- **Issues:** **no Project Proposal issue** (0 issues) → 0/20; dev container uses **MySQL 8.0** instead of PostgreSQL (3/5 compose); `postCreateCommand` runs inline `pip install …` with no declared dependency files (3/5 auto-install); app image `simple-python:latest` floating tag (3/5 reproducibility); no `.github` at all (no templates, no workflows); no pair-log; Maackyy below 30% (3/5 distribution); naming `MarketUES` lacks prefix (1/3).

### c90Beretta/Sportues — 43/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 20/20 | 4/20 | 0/20 | 0/15 | **43** |

- pnpm monorepo (`apps/` + `packages/`): NestJS API, Next.js admin, Astro public app; Prisma for DB.
- 6 commits — **all 6 by c90Beretta (100%)**; partner JoseNoperi has none.
- Strong container: `node:20` workspace + `postgres:16`, installs from declared workspace deps, Prisma generate, `.env` bootstrap, node_modules/npm-cache volumes → 20/20.
- **Issues:** **no Project Proposal** (0 issues) → 0/20; **zero PRs** — everything pushed directly to `main` (4/8); **partner has 0 commits** → 0/15 pair working (red flag); `.github` has only `workflows/` — no PR/issue templates; no pair-log; naming `Sportues` lacks prefix (1/3).

### MarcoST2049/REPOGradUES — 36/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 14/20 | 4/20 | 0/20 | 0/15 | **36** |

- **Empty skeleton**: `Back/` and `Front/` each contain only a 32-byte readme.txt — no application code.
- 2 commits, both by MarcoST2049 (100%), both Aug 30; 0 PRs.
- **Issues:** **no Project Proposal** (0 issues) → 0/20; unmodified ".NET (C#), Node.js (TypeScript) & MS SQL" template with **MSSQL 2019-latest** (3/5 compose), no app dependencies to install (3/5 auto-install), floating tag (3/5 reproducibility); **partner has 0 commits** → 0/15; `.github` has only `dependabot.yml`; no pair-log (no `docs/`); naming `REPOGradUES` lacks prefix (1/3).

### SaraCarmona03/VozUniversitaria — 45/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 14/20 | 4/20 | 0/20 | 8/15 | **45** |

- ASP.NET Core MVC app in `VozUniversitaria/` (Controllers, Models, Views, Program.cs) — server-rendered, no separate frontend.
- 5 commits — Vanesa03333 4 (80%), SaraCarmona03 1 (20%); 0 PRs (all direct pushes).
- **Issues:** **no Project Proposal** (0 issues) → 0/20; same unmodified ".NET + MS SQL" template as REPOGradUES — **MSSQL 2019-latest** (3/5 compose), `npm install` in `postCreateCommand` with no declared frontend deps (3/5 auto-install), floating tag (3/5); `bin/` and `obj/` build artifacts committed (gitignore hygiene); `.github` has only `dependabot.yml`; no pair-log; SaraCarmona03 below 30% (3/5 distribution); naming lacks prefix (1/3).

### PrometheusAgnostic/proyecto-cafeteria — 86/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 20/20 | 12/20 | 20/20 | 15/15 | **86** |

- Java Spring Boot (Maven) backend + Vue frontend; 19 commits — NoeVladimir 8 (42%), AngelSVCC 6 (32%), PrometheusAgnostic 5 (26%, all PR merges).
- **Issue #4 "Project Proposal"** (OPEN, Sep 7): complete Appendix E — problem, 30-second solution, primary entity **Pedido** (9 fields), related entity **Items del pedido** (1:N, 6 fields), initial scope → 20/20.
- Reference dev container: `postgres:16-bookworm` with healthcheck + `service_healthy`, `setup.sh` installs from declared deps, named volume, pinned tags → 20/20.
- `.github` has `ISSUE_TEMPLATE/` + a PR template **actually used** (all 6 merged PRs follow it); `docs/pair-log.md` with agreement + real first entry (Sep 6, driver/navigator named).
- **Issues:** one direct push to `main` (4/8 branch protection); Projects board unverified (0/4); naming lacks prefix (1/3); SSH unverified. Process anomalies worth a chat: AngelSVCC commits but is not a listed collaborator (pair-log names "Angel Santa Cruz y Noe Vladimir"); Tenkeii is a collaborator with 0 commits; early PRs #1–#2 targeted `master` before the rename to `main`.

### DessRod11/UESPORT — 47/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 20/20 | 8/20 | 0/20 | 0/15 | **47** |

- FastAPI backend + Vue 3/Vite/Tailwind frontend; 1 commit (Sep 6) by DessRod11 (100%); 0 PRs.
- Second-best container: `postgres:15` with healthcheck + `service_healthy`, pinned `python:3.11-slim` base with Node 20, `postCreateCommand` installs from declared files (`pip install -r requirements.txt`, `npm install`), named volume → 20/20.
- `.github` contains `pull_request_template.md` and `ISSUE_TEMPLATE/project_proposal.md` — **both 0-byte empty files** → 2/4 each.
- **Issues:** **no Project Proposal issue** (0 issues) → 0/20 — the template exists but was never used; **partner Karenpcruz has 0 commits** → 0/15 pair working; single direct push, no PRs (4/8); Projects board unverified (0/4); `docs/pair-log.md` is an unfinished stub ("Navigator: [Karen ?]"); naming `UESPORT` lacks prefix (1/3); minor hygiene: `.gitignore ` file with trailing space in its name.

### karlisnu/EduMatch — 37/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 10/15 | 14/20 | 4/20 | 0/20 | 0/15 | **37** |

- Static HTML/CSS/JS prototype at the repo root (`Alumnos/`, `js/`, image folders); README documents an Edu-Match tutoring platform (FR/NFR, use cases) but "how to run" is opening a local HTML file in a browser.
- 1 commit ("Primer commit", Sep 5) by karlisnu (100%); 0 PRs.
- **Issues:** **no Project Proposal** (0 issues) → 0/20; **no `.github` directory at all** (no templates, no workflows) → 0/8; unmodified ".NET + MS SQL" template with **MSSQL 2019-latest** (3/5 compose), no `postCreateCommand` and no app dependencies (3/5 auto-install), floating tag (3/5); **both partners have 0 commits** → 0/15; README file has no extension; images/fonts committed at the root; naming `EduMatch` lacks prefix (1/3).

### Laprapvk/university-health-container — 37/100

| Env | Shared | DevContainer | Workflow | Proposal | Pair | Total |
| --- | ------ | ------------ | -------- | -------- | ---- | ----- |
| 9/10 | 6/15 | 18/20 | 4/20 | 0/20 | 0/15 | **37** |

- FastAPI backend (`pyproject.toml` + `uv.lock`) + React 19/Vite/TypeScript/Tailwind frontend (`package.json` + `pnpm-lock.yaml`); README.md is empty.
- 1 commit ("chore: initial fullstack devcontainer setup", Sep 6) by Laprapvk (100%); 0 PRs.
- Well-built container: `postgres:16-alpine` with healthcheck + `service_healthy`, Redis 7, pinned `python:1-3.12-bookworm` base, Node 20 feature, rich extension list, port labels → 18/20 (auto-install 3/5: deps declared with lockfiles but no `setup.sh`/`postCreateCommand`, so nothing installs them on container start).
- **Issues:** **no partner collaborator was ever added** → 0/4 partner write access and 0/15 pair working (most basic Week-1 requirement); **no Project Proposal** (0 issues) → 0/20; **no `.github` directory** → 0/8; single direct push, no PRs (4/8); Projects board unverified (0/4); naming lacks prefix (1/3); SSH unverified.

## Findings summary

**Ranking**

| Rank | Repo | Score | One-line verdict |
| ---- | ---- | ----- | ---------------- |
| 1 | proyecto-cafeteria | 86/100 | The reference implementation — everything the guidelines ask for, actually done |
| 2 | LinkUES | 79/100 | Strong container + full proposal; held back by no pair-log and direct pushes |
| 3 | UESPORT | 47/100 | Excellent container, but solo work, no proposal, empty templates |
| 4 | MarketUES | 45/100 | Working split, but wrong DB, manual installs, no proposal |
| 4 | VozUniversitaria | 45/100 | Real .NET app, but unmodified MSSQL template, no proposal |
| 6 | Sportues | 43/100 | Best architecture of the cohort, but 100% one partner, zero PRs, no proposal |
| 7 | EduMatch | 37/100 | Static prototype in an unmodified template; no workflow, no pair activity |
| 7 | university-health-container | 37/100 | Good container; no partner, no proposal, no workflow |
| 9 | REPOGradUES | 36/100 | Empty skeleton two weeks in; no partner activity, no proposal |

**Key points for follow-up**

1. **The project proposal is the biggest gap.** Only 2 of 9 repos (proyecto-cafeteria, LinkUES) opened a `Project Proposal` issue. The Sep 8 deadline has passed — per the guidelines this blocks approval to start feature work, so the 7 missing proposals need a firm resubmission date.
2. **Pair participation is failing in half the cohort.** In 5 of 9 repos one partner has zero commits (Sportues, REPOGradUES, UESPORT, EduMatch, university-health-container); in university-health-container no partner was even added to the repo. The ≥30%-each rule will not be met at the milestone without intervention.
3. **Branch protection is not in effect anywhere.** All 9 repos show at least one direct push to `main`; none could be verified as enforcing PR + approval + CI. This is a 10-minute fix per repo and should be a requirement before Week 2.
4. **Three repos (REPOGradUES, VozUniversitaria, EduMatch) use the identical unmodified ".NET + MS SQL" devcontainer template** with MSSQL 2019 — the wrong database for the course. They need to move to the PostgreSQL compose setup (proyecto-cafeteria is the working example to point them at).
5. **Templates that exist but are empty don't count.** UESPORT has PR and issue template files that are 0 bytes; EduMatch and university-health-container have no `.github` at all.
6. **Two students to praise in front of the class:** the proyecto-cafeteria pair (complete proposal, real pair-log entries, PR templates in actual use, healthy Postgres container) and LinkUES (proactive Prisma migrations + seed in the container, full proposal).

**Suggested next steps (in priority order)**

1. Set a resubmission deadline for the 7 missing proposals.
2. Require branch protection + PR template in every repo before Week 2 starts.
3. Send a note to the 5 solo-working pairs; ask university-health-container to add their partner.
4. Share the proyecto-cafeteria devcontainer as the reference for the MSSQL-template repos.
5. Verify at the milestone: `docs/pair-log.md` entries, commit distribution ≥30% each, and both partners opening the container (the "golden rule" check).
