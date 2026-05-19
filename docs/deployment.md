# Deployment guide

This guide covers deploying **Guia de Bolso** to production using **Vercel** (frontend + serverless API) and **Supabase** (database, auth, storage).

| Environment | URL |
|-------------|-----|
| **Production** | https://guia-de-bolso-puce.vercel.app |
| **Repository** | https://github.com/BrunoDislilerDev/guia-de-bolso |

---

## Architecture overview

```text
Developer machine
    │  git push
    ▼
GitHub (main / PR branches)
    │  webhook
    ▼
Vercel ──────────────────────────────┐
  • Next.js 16 build                 │
  • Static assets + SSR pages        │
  • Serverless /api/* (Claude)       │
    │ env: SUPABASE_*, ANTHROPIC_*   │
    ▼                                │
Supabase (us-west-2) ◄───────────────┘
  • PostgreSQL + RLS
  • Auth (Google, SMS/Twilio)
  • Storage (photos, avatars)
```

External services used at runtime (no Vercel env required unless noted):

- **Anthropic** — AI search & roteiros (`ANTHROPIC_API_KEY`)
- **Open-Meteo** — weather for home context (public API)
- **OpenStreetMap** — static map thumbnails on place detail
- **Google Maps** — admin address autocomplete only (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, optional)

---

## Prerequisites

Before the first production deploy:

| Requirement | Notes |
|-------------|--------|
| GitHub repository | Connected to Vercel |
| Supabase project | Production project in `us-west-2` (or your chosen region) |
| Anthropic account | API key with billing enabled |
| Supabase Auth | Google OAuth app; Twilio for SMS OTP (via Supabase) |
| Node.js 20+ | Local builds and optional CI |

---

## Environment variables

### Local development

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Never commit `.env.local` — it is in `.gitignore`.

### Vercel configuration

Set variables in **Vercel → Project → Settings → Environment Variables**.

Apply to **Production**, **Preview**, and **Development** as appropriate (preview can share production Supabase or use a separate Supabase project).

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Supabase project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + Server | Supabase **anon** / publishable key (RLS applies) |
| `ANTHROPIC_API_KEY` | Yes | Server only | Claude API secret for `/api/buscar` and `/api/roteiro` |
| `ANTHROPIC_MODEL` | Recommended | Server only | Model id, e.g. `claude-sonnet-4-5` (fallback in code if omitted) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Client | Admin place form — Places Autocomplete (`EnderecoAutocomplete`) |

### Variables you must NOT expose

| Variable | Why |
|----------|-----|
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS — never use `NEXT_PUBLIC_*` or ship to the browser |
| `ANTHROPIC_API_KEY` | Must not use `NEXT_PUBLIC_` prefix |

The app uses only the **anon** key on client and server (`@supabase/ssr`). Server routes that load the public catalog use the same anon client with RLS.

### Example `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-5

# Optional — admin address autocomplete only
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

After changing env vars in Vercel, **redeploy** (or trigger a new deployment) so serverless functions pick up new values.

---

## Build steps

### Local verification (before every production push)

```bash
# 1. Install dependencies
npm install

# 2. Lint (optional but recommended)
npm run lint

# 3. Production build
npm run build

# 4. Smoke-test production server locally
npm run start
# Open http://localhost:3000
```

### What `npm run build` does

| Step | Detail |
|------|--------|
| Framework | Next.js 16 (App Router) |
| Command | `next build` |
| Output | `.next/` — static pages, server components, API routes |
| Middleware | `middleware.js` — Supabase session refresh on matched routes |

### Vercel project settings

| Setting | Value |
|---------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `.` (repository root) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | Next.js default (leave empty) |
| **Install Command** | `npm install` (default) |
| **Node.js Version** | **20.x** (recommended; set in Project → Settings → General) |

No `vercel.json` is required for the default Next.js flow.

### Build-time vs runtime

- **`NEXT_PUBLIC_*`** — inlined at build time for client bundles; changing them requires a **new deployment**.
- **`ANTHROPIC_*` (no prefix)** — read at runtime in Route Handlers (`/api/*`); updating in Vercel applies on next invocation after redeploy.

---

## CI/CD workflow

### Primary pipeline: Vercel + GitHub

This project uses **Vercel’s Git integration** as the main CI/CD path (no custom workflow file is required in the repo).

```mermaid
flowchart LR
  A[git push / merge PR] --> B[GitHub]
  B --> C{Vercel}
  C -->|main branch| D[Production deploy]
  C -->|other branches / PR| E[Preview deploy]
  D --> F[guia-de-bolso-puce.vercel.app]
  E --> G[*.vercel.app preview URL]
```

| Event | Vercel action |
|-------|----------------|
| Push to `main` | Production deployment |
| Pull request opened/updated | Preview deployment (unique URL) |
| Push to other branches | Preview (if enabled in Vercel) |

**Typical release flow:**

1. Develop on a feature branch → open PR → Vercel posts preview URL on the PR.
2. Test preview (see [Preview deployments](#preview-deployments)).
3. Merge to `main` → automatic production build and promote.
4. Run [production smoke tests](#production-smoke-tests).

### Recommended: GitHub Actions (optional quality gate)

The repository does not ship a workflow file by default. To run lint/build on every PR **before** or **alongside** Vercel, add `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - run: npm ci

      - run: npm run lint

      - run: npm run build
        env:
          # Build needs public env; secrets optional for compile-only check
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          ANTHROPIC_MODEL: ${{ secrets.ANTHROPIC_MODEL || 'claude-sonnet-4-5' }}
```

Add the same secrets in **GitHub → Repository → Settings → Secrets and variables → Actions**. Vercel still performs the actual deploy; Actions only validates the build.

### Deployment commands (manual)

Vercel CLI is optional:

```bash
npx vercel          # preview
npx vercel --prod   # production (requires linked project)
```

Day-to-day deploys are normally **`git push`** only.

---

## Supabase production setup

### 1. Auth URL configuration

**Supabase Dashboard → Authentication → URL Configuration**

| Field | Production value |
|-------|------------------|
| **Site URL** | `https://guia-de-bolso-puce.vercel.app` |
| **Redirect URLs** | `https://guia-de-bolso-puce.vercel.app/auth/callback` |

For **preview** deploys, add each origin you use:

```text
https://<branch>-<team>.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

(Use the exact patterns Supabase allows for your project; wildcard support may vary.)

### 2. Auth providers

| Provider | Configuration |
|----------|----------------|
| **Google** | OAuth client ID/secret in Supabase → Authentication → Providers |
| **Phone (SMS)** | Twilio credentials in Supabase (OTP login in `AuthFlow`) |

### 3. SQL migrations

Run scripts from [`/supabase`](../supabase) in the **SQL Editor** in order. See [Database → Migration checklist](./database.md#migration-checklist-new-environment).

| Order | File |
|-------|------|
| 1 | Base schema (tables created in dashboard / legacy scripts) |
| 2 | `premium_usuario.sql` |
| 3 | `increment_uso_ia.sql` |
| 3b | `premium_uso_diario.sql` *(optional)* — `COMMENT ON COLUMN` only; safe before or after step 3 |
| 4 | `perfis_premium_policies.sql` |
| 5 | `perfis_role_check.sql` |
| 6 | `tags_categorias.sql` |
| 7 | `fotos_migration.sql` |
| 8 | `storage-policies.sql` |
| 9 | `logs_policies.sql` |

After migrations:

- Confirm **RLS enabled** on each application table (repo scripts only enable `perfis` and `logs`; verify policies in Dashboard).
- Grant `authenticated` execute on `increment_busca_ia` / `increment_roteiro_ia`.

### 4. Storage buckets

Create **public** buckets if they do not exist:

| Bucket | Purpose |
|--------|---------|
| `lugares-fotos` | Place gallery (admin upload) |
| `rotas-fotos` | Route covers |
| `imagens` | User avatars (`avatars/{user_id}/`) |

Apply policies from `fotos_migration.sql` and `storage-policies.sql`.

### 5. First admin user

1. Sign up in production (Google or SMS).
2. In SQL Editor, set role on `perfis`:

```sql
UPDATE perfis SET role = 'admin' WHERE id = '<auth.users.uuid>';
```

3. Open `/admin` and confirm access.

---

## Preview deployments

| Topic | Guidance |
|-------|----------|
| **URL** | Vercel assigns `https://<project>-<hash>.vercel.app` per deployment |
| **Env vars** | Inherit Preview env in Vercel (can mirror Production or use a staging Supabase) |
| **Auth** | Add preview callback URL to Supabase redirect list |
| **AI usage** | Preview shares Anthropic quota if using the same API key |

Test on preview: home, login, `/api/buscar` (logged in), place detail, admin (if admin user exists in that DB).

---

## Production checklist

Use this list for **first launch** and **each major release**.

### Repository & Vercel

- [ ] GitHub repo connected to Vercel project
- [ ] Production branch set to `main` (or your default)
- [ ] Node.js **20.x** in Vercel project settings
- [ ] All [required environment variables](#environment-variables) set for **Production**
- [ ] Preview env vars set if PR previews use a real backend
- [ ] `npm run build` passes locally on release commit
- [ ] No secrets in git history (`.env.local` never committed)

### Supabase

- [ ] Production project region and backups understood (plan limits)
- [ ] Migrations applied in documented order
- [ ] RLS enabled and tested (anonymous read / authenticated write / admin writes)
- [ ] RPC `increment_busca_ia` and `increment_roteiro_ia` exist and are granted to `authenticated`
- [ ] Storage buckets + policies applied
- [ ] Auth Site URL and Redirect URLs include production (and previews if needed)
- [ ] Google OAuth and SMS tested end-to-end on production domain
- [ ] At least one `admin` or `dev` user on `perfis`

### Application smoke tests

- [ ] Home loads — places, hero, search UI
- [ ] Guest can browse categories and place detail
- [ ] Login (Google + SMS) → redirect to `/` via `/auth/callback`
- [ ] Logged-in user: favorite, review submit (pending moderation)
- [ ] AI search (`POST /api/buscar`) — success and limit/paywall when applicable
- [ ] AI roteiro on `/rotas` — generate and save
- [ ] Maps CTA on place detail opens Google / Apple / Waze
- [ ] Admin `/admin` — dashboard, edit place, moderate review
- [ ] Images load from Supabase Storage URLs

### Security

- [ ] `ANTHROPIC_API_KEY` only in server env (not `NEXT_PUBLIC_*`)
- [ ] Service role key **not** in Vercel or client
- [ ] Supabase redirect URLs limited to known domains
- [ ] Admin UI gated by `perfis.role` (`admin` / `dev`)
- [ ] Reviews public only when `status = aprovada`

### Observability & rollback

- [ ] Vercel deployment notifications enabled (email/Slack)
- [ ] Know how to open **Vercel → Deployments → Redeploy** previous build
- [ ] Supabase backup / PITR understood before destructive SQL
- [ ] Check Vercel function logs if `/api/*` returns 500
- [ ] Admin dashboard `logs` table receiving events (`acessou_app`, `login`, etc.)

### Post-deploy

- [ ] Update README or internal docs if URLs or env names changed
- [ ] Monitor Anthropic usage and Supabase quotas after launch week

---

## Production smoke tests (quick script)

| # | Action | Expected |
|---|--------|----------|
| 1 | Open `/` | Home sections load without console errors |
| 2 | Search while logged in | Results or empty state; usage counter updates |
| 3 | Open `/lugares/<id>` | Detail, photos, CTA |
| 4 | `/login` → Google or SMS | Session + avatar on home |
| 5 | `/favoritos` | List or empty state when logged in |
| 6 | `/rotas` → create roteiro | Sheet works; save appears in list |
| 7 | `/admin` as admin | Dashboard metrics load |

---

## Rollback

| Layer | Action |
|-------|--------|
| **Application** | Vercel → Deployments → select previous successful deployment → **Redeploy** |
| **Database** | Avoid rolling back app without DB compatibility; use Supabase backups / PITR for data issues |
| **Env vars** | Revert in Vercel settings and redeploy |

---

## Monitoring

| Source | What to check |
|--------|----------------|
| **Vercel** | Build logs, Function logs for `/api/buscar`, `/api/roteiro`, `/api/uso-premium` |
| **Supabase** | Auth logs, API errors, disk usage, RLS denials |
| **Anthropic** | Token usage and rate limits |
| **App** | Admin → Dashboard → activity `logs` |

---

## Performance notes

- Place/route images are served from **Supabase Storage** (CDN).
- AI routes are **serverless** — cold starts possible after idle periods.
- Static map images on place detail call **OpenStreetMap** (third-party latency).
- Middleware runs on most routes to refresh auth cookies (small overhead per request).

---

## Related documentation

- [Architecture](./architecture.md) — system design and auth flow
- [Database](./database.md) — schema, RLS, migrations
- [API](./api.md) — Route Handlers and env usage
- [Contributing](./contributing.md) — local development conventions
