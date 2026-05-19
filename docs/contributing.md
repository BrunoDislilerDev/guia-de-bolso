# Contributing

Thank you for contributing to Guia de Bolso. This guide covers local setup, conventions, and how to propose changes.

## Getting started

### Prerequisites

- **Node.js** 20+
- **npm**
- **Git**
- Supabase project access (or a personal fork + Supabase project)
- Anthropic API key (for AI features)

### Setup

```bash
git clone https://github.com/BrunoDislilerDev/guia-de-bolso.git
cd guia-de-bolso
npm install
```

Create `.env.local` at the project root (copy from [`.env.example`](../.env.example) if present):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-5
# Optional — admin place form (Google Places Autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Run database migrations — see [Database](./database.md#migration-checklist-new-environment).

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000

### Verify your setup

```bash
npm run build   # must pass before PR
npm run lint    # ESLint
```

---

## Project conventions

### Language

- **JavaScript only** — no TypeScript (project decision)
- User-facing copy in **Brazilian Portuguese (pt-BR)**
- Code comments in Portuguese or English (be consistent within a file)

### Framework

- **Next.js 16 App Router** — read `node_modules/next/dist/docs/` before changing routing or server APIs (project may differ from older Next.js versions)
- Prefer **Client Components** only when needed (hooks, browser APIs, auth state)
- Keep business logic in `lib/`, not scattered in UI files

### Styling

- **Tailwind CSS 4**
- Mobile-first layout (~`max-w-md` centered column)
- Brand greens: `#1a4a3a` (primary), background `#f0f4f3`
- Use existing patterns from `components/home/` and `components/lugar/`

### File organization

| Path | Purpose |
|------|---------|
| `app/` | Routes and pages |
| `components/` | Reusable UI (group by domain) |
| `lib/` | Helpers, Supabase clients, domain logic |
| `supabase/` | SQL migrations (manual) |
| `docs/` | Project documentation |
| `public/` | Static assets |

### Supabase

- Never commit secrets or `.env.local`
- Schema changes require a new `.sql` file in `supabase/` with a short header comment
- Document migration order in `docs/database.md` and root `README.md`

### AI features

- API keys only in server routes (`app/api/`)
- Respect premium limits — test with `premium_ativo = false` on your profile
- Keep prompts concise; use summarized place context (`lib/busca.js`)

---

## Branching & commits

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/minha-feature
   ```

2. Make focused changes (one feature or fix per PR when possible).

3. Commit messages — use clear, imperative Portuguese or English:

   ```
   feat: redesign da home com sugestões contextuais
   fix: contador de busca IA não incrementava
   docs: adiciona guia de deployment
   ```

4. Push and open a Pull Request on GitHub.

---

## Pull request checklist

- [ ] `npm run build` passes locally
- [ ] No secrets in diff
- [ ] UI tested on mobile viewport (~390px)
- [ ] Auth flows tested if touching login/favorites/search
- [ ] SQL migrations documented if added
- [ ] `README.md` or `docs/` updated for user-visible changes

---

## Areas that need care

| Area | Note |
|------|------|
| Premium counters | Requires SQL functions `increment_*_ia`; test 1→2→3→paywall |
| RLS | Test as anonymous, user, and admin |
| Place type detection | `isLugarPublico()` in `lib/lugarDetalhe.js` — beaches vs restaurants |
| Geolocation | Features degrade gracefully without GPS permission |
| Admin | Confirm `role` is `admin` or `dev` on your test profile |

---

## Code review expectations

- Prefer small, reviewable PRs
- Include screenshots or screen recordings for UI changes
- Explain breaking changes in the PR description
- Link related issues when applicable

---

## Reporting issues

Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser/device
- Whether user was logged in / premium
- Console or network errors if relevant

---

## Documentation

When adding features, update as needed:

- `README.md` — high-level overview
- `docs/CHANGELOG.md` — release notes (semver)
- `docs/features.md` — product behavior
- `docs/api.md` — new endpoints
- `docs/database.md` — schema changes
- `CLAUDE.md` — agent context (optional, for AI assistants)

---

## License & contact

This is a private/portfolio project by [Bruno Disliler](https://brunodisliler.com).  
For questions about contributing, open a GitHub issue or contact the maintainer.

## Related docs

- [Architecture](./architecture.md)
- [Deployment](./deployment.md)
- [Features](./features.md)
