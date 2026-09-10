# Week 1 Review Guidelines — Environment & Workflow

> **Milestone:** M1 — Foundations & UI (Sep 8 → Sep 30, 2026)
> **Week 1 window:** Sep 1–8, 2026
> **Scope:** Step 0 — Environment & Workflow (Guide Section 5)

---

## Key Points to Review

### 1. Environment Setup

- [ ] Docker Desktop installed and working (`docker --version`)
- [ ] VS Code + Dev Containers extension installed
- [ ] Git configured with SSH keys for GitHub (`git --version`)

### 2. Shared Repository

- [ ] Private repository created with naming convention `<course>-<yourapp>`
- [ ] Both partners added as collaborators with write access
- [ ] Both partners can clone via SSH

### 3. Dev Container Working

- [ ] `.devcontainer/devcontainer.json` properly configured
- [ ] `.devcontainer/docker-compose.yml` with app + PostgreSQL services
- [ ] `.devcontainer/setup.sh` installs dependencies automatically
- [ ] **Both partners** can open the container and get an identical working environment:
  - `python --version` / `node --version` work
  - Database connection works: `psql postgresql://dev:dev@db:5432/appdb -c "select 1;"`

> **Golden rule:** If it works for one partner and not the other, fix the container, not the machine.

### 4. GitHub Workflow Configured

- [ ] `main` branch protected (requires PR + 1 approval + CI checks)
- [ ] Pull request template exists (`.github/pull_request_template.md`)
- [ ] Issue templates set up (`.github/ISSUE_TEMPLATE/`)
- [ ] Projects board created with columns: Todo / In progress / In review / Done

### 5. Project Proposal Submitted (Due Sep 8)

- [ ] GitHub Issue titled `Project Proposal` opened
- [ ] Uses the template from Appendix E of the guide
- [ ] Defines primary entity (6+ fields)
- [ ] Defines related entity (one-to-many relationship)
- [ ] Explains the problem it solves in 30 seconds

### 6. Pair Working Agreement

- [ ] Both partners understand the "both do both sides" rule
- [ ] `docs/pair-log.md` file created with first entry logged
- [ ] Driver/Navigator rotation understood (swap every 20 minutes)

---

## Red Flags to Watch For

| Issue | Why it matters |
|-------|---------------|
| Only one partner can open the container | Violates the core principle — fix the container, not the machine |
| Dependencies installed manually | Must be declared in `requirements.txt` / `package.json` and installed by rebuilding the container |
| No branch protection set up | Will block the PR workflow required for M1 deliverables |
| Project proposal not submitted by Sep 8 | Blocks approval to proceed with feature work |
| No commits from both partners | Must show ≥30% from each at milestone time |
| Direct pushes to `main` | Branch protection must prevent this from day one |

---

## Verification Commands

Run these inside the dev container to confirm everything works:

```bash
# Tool versions
node --version        # → v22.x
python --version      # → 3.12.x (or dotnet --version → 8.x for .NET path)
git --version

# Database connectivity
psql postgresql://dev:dev@db:5432/appdb -c "select 1;"

# Frontend runs
cd frontend && npm run dev   # → http://localhost:5173

# Backend runs
cd backend && uvicorn app.main:app --reload   # → http://localhost:8000
# or for .NET: cd backend/src/ClassroomTracker.Api && dotnet watch  # → http://localhost:5000
```

---

## What Comes Next (Week 2+)

Once Week 1 is complete, students move to **M1 feature work**:

1. Scaffold both apps (frontend + backend)
2. Add Tailwind CSS
3. Design the data model → `docs/architecture.md`
4. Build the static UI (list, detail, form, 404 pages)
5. Add routing with React Router
6. Add a validated form
7. Make it responsive (375px, 768px, 1280px)
8. Stand up a read-only backend (2 endpoints, correct status codes)
9. Write the README
