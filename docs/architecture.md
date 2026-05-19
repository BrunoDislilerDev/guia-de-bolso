# System architecture

Guia de Bolso is a **mobile-first web application** for local discovery in Garopaba and Imbituba (Santa Catarina, Brazil). The system helps users decide what to do in real time by combining curated place data, live context (hours, geolocation, weather-aware copy), moderated reviews, and **Anthropic Claude**–powered search and trip planning.

This document describes how the frontend, backend, data plane, authentication, and external services fit together in production.

---

## System context

```mermaid
flowchart TB
  subgraph Client["Client (browser)"]
    UI["Next.js UI\nReact 19 · Tailwind 4"]
    BC["Supabase browser client\n@supabase/ssr"]
    LS["localStorage\nonboarding · maps · usage backup"]
  end

  subgraph Vercel["Vercel (Next.js 16)"]
    MW["middleware.js\nsession refresh"]
    Pages["App Router pages\napp/**"]
    API["Route Handlers\napp/api/**"]
  end

  subgraph Supabase["Supabase (us-west-2)"]
    Auth["Auth\nGoogle · SMS OTP"]
    PG["PostgreSQL + RLS"]
    ST["Storage\nimages"]
    RPC["RPC\nincrement_*_ia"]
  end

  subgraph External["Third-party APIs"]
    Claude["Anthropic Claude"]
    Meteo["Open-Meteo"]
    OSM["OpenStreetMap\nstatic maps"]
    Maps["Google / Apple / Waze\ndeep links"]
    GMaps["Google Maps\nadmin geocoding"]
  end

  UI --> Pages
  UI --> BC
  BC --> Auth
  BC --> PG
  Pages --> MW
  MW --> Auth
  API --> Auth
  API --> PG
  API --> RPC
  API --> Claude
  Pages --> ST
  UI --> LS
  UI --> Maps
  Pages --> Meteo
  Pages --> OSM
  Admin["Admin UI"] --> GMaps
```

| Property | Value |
|----------|--------|
| **Deployment** | Vercel (serverless Next.js) |
| **Data region** | Supabase `us-west-2` |
| **Primary language** | JavaScript (no TypeScript) |
| **Session model** | Supabase Auth cookies via `@supabase/ssr` |

---

## Frontend architecture

### Framework and rendering model

The UI is built with **Next.js 16 App Router**. The root layout (`app/layout.js`) is a Server Component that sets fonts (Inter, Plus Jakarta Sans), global CSS, and `lang="pt-BR"`.

Almost all product surfaces are **Client Components** (`"use client"`) because they depend on:

- React hooks (`useState`, `useEffect`, `useRef`)
- Browser APIs (`navigator.geolocation`, `localStorage`, `navigator.share`)
- Supabase auth state listeners
- Interactive search overlays and bottom sheets

There is no global React Context for auth or premium; each page or hook loads session and usage as needed.

### Route map (consumer)

| Route | Module | Purpose |
|-------|--------|---------|
| `/` | `app/page.js` | Decision-oriented home |
| `/lugares/[id]` | `app/lugares/[id]/page.js` | Conversion-focused place detail |
| `/categorias`, `/categoria/[slug]` | Category discovery |
| `/favoritos` | Saved places (auth) |
| `/rotas`, `/rotas/[id]` | Curated routes + AI itineraries |
| `/perfil`, `/perfil/editar` | User profile |
| `/login` | `app/login/page.js` | Auth entry |

### Component organization

Components are grouped by **domain**, not by atomic design tier:

```
components/
├── home/                  # Home (header, search, hero, trending, plans)
├── lugar/                 # Place detail (hero, actions, reviews, CTA)
├── admin/                 # CMS forms, grid, AdminShell
├── rotas/                 # RoteiroSection, RoteiroContent, bottom sheet
├── BottomNav.js           # Consumer bottom navigation
├── LoginModal.js
├── Onboarding.js
├── PremiumPaywallSheet.js
├── DailyLimitCountdown.js
├── AuthFlow.js
├── ClimaCard.js           # Beach weather (not mounted on home today)
└── …                      # Other root-level UI (maps, autocomplete, etc.)
```

**Home** logic is driven by `lib/homeContext.js` (contextual phrases, quick-search chips, hero selection, preset plans). **Place detail** uses `lib/lugarDetalhe.js` to distinguish public venues (beaches, trails) from establishments (restaurants, services) and to shape quick actions.

### Client-side state patterns

| Concern | Mechanism |
|---------|-----------|
| Auth session | `createClient()` from `lib/supabase/client.js` → `getUser()`, `onAuthStateChange` |
| Premium usage | `usePremiumUsage` → hydrate `localStorage` (`guia_premium_usage_{userId}`) for current day → `GET /api/uso-premium` (server wins); exposes `loading` / `synced`; countdown via `DailyLimitCountdown` (`msUntilReset` optional) |
| Recent places (search) | `lib/lugaresVisitados.js` → `localStorage` |
| Preferred maps app | `localStorage` key `map_app_preferido` |
| Onboarding | `localStorage` key `onboarding_visto` |
| Geolocation | `navigator.geolocation` on home and place detail for distance |

### UI constraints

- **Mobile-first**: content column ~`max-w-md`, centered on desktop
- **Design tokens**: primary green `#1a4a3a`, background `#f0f4f3`
- **Navigation**: floating `BottomNav` on main consumer routes

### Admin frontend

Admin pages wrap content in `AdminShell`, which uses `useAdminAuth()`:

1. Load session via browser Supabase client.
2. Fetch `perfis` row for current user.
3. Redirect to `/` if unauthenticated or `role` is not admin-capable (`lib/adminRoles.js`).

There is **no server-side admin layout guard**; protection is client-side plus RLS on writes.

---

## Backend architecture

The “backend” is not a separate service. It consists of:

1. **Next.js Route Handlers** (`app/api/**`) — serverless functions on Vercel  
2. **Supabase** — database, auth, storage, RLS, RPC  
3. **Middleware** — session cookie refresh on every matched request  

### Supabase clients (three entry points)

| Export | File | Used for |
|--------|------|----------|
| Browser client | `lib/supabase/client.js` | Client Components, auth, direct reads/writes under RLS |
| Server client | `lib/supabase/server.js` | Route Handlers, OAuth callback, cookie-aware session |
| Anon service client | `lib/supabase.js` → `supabase` | Route Handlers that query places without user session (e.g. load catalog before auth check) |

```text
lib/supabase.js
├── export { createClient } from "./supabase/client"   // browser
└── export const supabase = createSupabaseClient(...)   // anon key, no cookies
```

### API routes (serverless)

| Endpoint | Auth | Responsibility |
|----------|------|----------------|
| `POST /api/buscar` | Required | Premium check → load places → Claude ranking → filter → `increment_busca_ia` |
| `POST /api/roteiro` | Required | Generate itinerary (Claude), premium check, token-optimized prompt |
| `POST /api/roteiro/salvar` | Required | Insert into `roteiros` |
| `GET /api/uso-premium` | Optional | Returns `{ loggedIn, usage }`; `usage` when session present |

Server-only secrets: `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`. These never use the `NEXT_PUBLIC_` prefix.

### Domain services (`lib/`)

| Module | Layer | Role |
|--------|-------|------|
| `premium.js` | Shared | Daily limits, `getUsageDayKey()`, `isSameUsageDay()`, `normalizeUsageFromPerfil`, `isDailyBuscaLimitReached` |
| `premiumServer.js` | Server | `getAuthUser`, `checkBuscaAccess`, RPC increment wrappers |
| `busca.js` | Shared | Open/closed filter, compact summaries for Claude |
| `horarios.js` | Shared | Brazil timezone hours, `getStatusFuncionamento` |
| `localizacao.js` | Shared | Haversine distance, `withDistanciaDinamica` |
| `logs.js` | Shared | Insert into `logs` for analytics |
| `storageUpload.js` | Client | Admin photo upload to Storage |

### Middleware

`middleware.js` runs on almost all routes (excluding static assets). It:

1. Creates a Supabase server client bound to request/response cookies.
2. Calls `supabase.auth.getUser()` to **refresh the session** if needed.
3. Returns `NextResponse.next()` with updated cookies.

Middleware does **not** enforce route-level auth; pages and APIs enforce access themselves.

### What is not on the server

- No standalone Express/FastAPI service  
- No Redis or message queue  
- No edge-configured rate limiting (limits are application-level via `perfis` + RPC)  
- No GraphQL layer  

---

## Data flow

### 1. Public read path (direct to Supabase)

Most read-only consumer data bypasses Next.js APIs and goes **browser → Supabase** under RLS:

```mermaid
sequenceDiagram
  participant UI as Client Component
  participant SB as Supabase PostgreSQL
  participant RLS as Row Level Security

  UI->>SB: .from("lugares").select(...).eq("status","ativo")
  SB->>RLS: policy check
  RLS-->>SB: allowed rows
  SB-->>UI: places + joins (localizacoes, tags)
```

Typical joins on place detail:

- `lugares` + `localizacoes` + `lugares_tags` → `tags`
- `fotos_lugar` or JSON `fotos` on place row
- `avaliacoes` where `status = 'aprovada'`

### 2. AI search path

```mermaid
sequenceDiagram
  participant UI as SmartSearch
  participant API as POST /api/buscar
  participant PS as premiumServer
  participant SB as Supabase
  participant RPC as increment_busca_ia
  participant AI as Anthropic API

  UI->>API: { query, filtroStatus }
  API->>PS: getAuthUser + checkBuscaAccess(increment)
  PS->>SB: auth.getUser (cookies)
  PS->>RPC: increment on allow
  API->>SB: select active lugares + relations
  API->>API: buildLugarBuscaResumo, filtrarLugaresPorStatus
  API->>AI: messages + place summaries
  AI-->>API: JSON array of place IDs
  API->>API: map IDs to full rows, post-filter
  API-->>UI: { lugares, usage, message? }
  UI->>UI: setUsage / refresh from response.usage
```

**Post-processing:** Client may apply `withDistanciaDinamica` after results return. Status filter can run **before** AI (narrow catalog) and **after** AI (safety net).

### 3. Authenticated write path (favorites, reviews)

```mermaid
sequenceDiagram
  participant UI as Place / Favorites UI
  participant SB as Supabase
  participant RLS as RLS

  UI->>SB: auth.getUser()
  UI->>SB: .from("favoritos").insert/delete
  SB->>RLS: user_id = auth.uid()
  RLS-->>UI: success / error
  UI->>SB: logs via registrarLog (optional)
```

Reviews insert with `status: 'pendente'`; public reads only see `aprovada`.

### 4. Place detail load path

```mermaid
flowchart LR
  A["/lugares/[id] mount"] --> B["Parallel Supabase queries"]
  B --> C["lugares by id"]
  B --> D["localizacoes"]
  B --> E["lugares_tags"]
  B --> F["avaliacoes aprovadas"]
  B --> G["fotos_lugar"]
  C --> H["lib/lugarDetalhe\nfrase, bullets, actions"]
  D --> I["localizacao.js\ndistance + static map URL"]
  H --> J["Render LugarHero → sections"]
```

`saveLugarVisitado` writes to `localStorage` for search browse panel.

### 5. Admin write path

```mermaid
flowchart LR
  A[Admin form] --> B[Supabase client]
  B --> C{RLS: admin role}
  C -->|allow| D[(lugares / rotas / destaques)]
  B --> E[Storage upload]
  E --> F[(lugares-fotos bucket)]
```

### 6. Roteiro (itinerary) path

1. User completes form on `/rotas` (logged in).  
2. `POST /api/roteiro` — premium check, filtered place list, Claude generates markdown/structured content.  
3. Optional `POST /api/roteiro/salvar` — persists to `roteiros` table.  
4. UI renders via `RoteiroContent` + `lib/roteiroMarkdown.js`.

---

## Authentication flow

Authentication is fully delegated to **Supabase Auth**. The app does not implement custom JWT logic.

### Session transport

- **Cookies** managed by `@supabase/ssr` (`createBrowserClient` / `createServerClient`).
- **Middleware** refreshes session on each navigation.
- **Server Route Handlers** read the same cookies via `lib/supabase/server.js`.

### Google OAuth

```mermaid
sequenceDiagram
  participant U as User
  participant UI as AuthFlow / Login
  participant SB as Supabase Auth
  participant G as Google
  participant CB as GET /auth/callback
  participant App as Home /

  U->>UI: Continuar com Google
  UI->>SB: signInWithOAuth({ provider: google })
  SB->>G: OAuth consent
  G-->>SB: authorization code
  SB-->>UI: redirect to /auth/callback?code=...
  UI->>CB: browser follows redirect
  CB->>SB: exchangeCodeForSession(code)
  CB->>CB: registrarLog("login")
  CB-->>App: redirect to / or next=
```

Callback implementation: `app/auth/callback/route.js`.

### SMS OTP (phone)

```mermaid
sequenceDiagram
  participant U as User
  participant UI as AuthFlow
  participant SB as Supabase Auth
  participant T as Twilio (via Supabase)

  U->>UI: Enter phone +55...
  UI->>SB: signInWithOtp({ phone })
  SB->>T: SMS with OTP
  T-->>U: 6-digit code
  U->>UI: Enter code
  UI->>SB: verifyOtp({ phone, token })
  SB-->>UI: session established
  UI-->>U: router.push("/")
```

Phone validation: 11 digits (DDD + number), formatted in UI. Resend is rate-limited in the client (counter + cooldown).

### Profile bootstrap

On first login, Supabase creates `auth.users`. The app expects a matching row in **`perfis`** (same `id`). Profile fields (`nome`, `foto_url`, `role`, premium columns) are read on admin check and profile pages. Creation may occur via trigger or first profile update—verify in Supabase project settings.

### Authorization (not authentication)

| Layer | Mechanism |
|-------|-----------|
| **Premium features** | `perfis.premium_ativo`; daily counters `buscas_ia` / `roteiros_ia` in `uso_ia_mes` (day key `YYYY-MM-DD`, SP); limits 3 buscas + 2 roteiros/day; Premium unlimited |
| **Admin** | `perfis.role` ∈ `admin`, `dev` (`canAccessAdmin`) |
| **Public content** | RLS: active places, approved reviews |
| **Gated UI** | `LoginModal` for favorites, reviews, **AI search**, and **AI roteiro**; curated `/rotas` list and route detail are public |

API returns machine-readable codes: `LOGIN_REQUIRED` (401), `LIMIT_REACHED` (403).

### Auth state on the home page

`app/page.js`:

1. `supabase.auth.getUser()` on mount.  
2. `onAuthStateChange` to update user + clear favorites on sign-out.  
3. Premium hook `usePremiumUsage(user)` hydrates same-day cache, then fetches `/api/uso-premium`; home search and `/rotas` show usage + `DailyLimitCountdown` when limit reached.

---

## Third-party services

| Service | Integration point | Purpose | Credentials |
|---------|-------------------|---------|-------------|
| **Supabase** | `lib/supabase/*`, all data/auth | PostgreSQL, Auth, Storage, RLS, RPC | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Anthropic Claude** | `app/api/buscar`, `app/api/roteiro` | Semantic search + itineraries | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` |
| **Vercel** | Git push → deploy | Hosting, serverless, CDN | Vercel project env vars |
| **Google OAuth** | Supabase Auth provider | Social login | Configured in Supabase dashboard |
| **Twilio** | Supabase Auth (SMS provider) | OTP delivery | Supabase + Twilio config |
| **Open-Meteo** | `lib/clima.js`, `ClimaCard` (when enabled) | Weather/marine forecast | None (public API) |
| **OpenStreetMap** | `lib/lugarDetalhe.getStaticMapUrl` | Static map preview on place detail | None (public tile/static API) |
| **Google Maps** | Admin `LocalForm`, user deep links | Geocoding/places autocomplete (admin), navigation | Browser keys / Places API in admin |
| **Apple Maps / Waze** | User-initiated deep links only | Turn-by-turn navigation | None |

### Anthropic API

- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Search:** low `max_tokens` (256), system prompt returns JSON array of place IDs only
- **Roteiro:** higher token budget, structured prompt, reduced place context via `lib/roteiroLugares.js`

### Supabase Auth providers

- **Google:** OAuth 2.0 redirect flow through `/auth/callback`
- **Phone:** OTP; Brazil numbers via `+55` prefix in `AuthFlow`

### Maps (client-side only)

No server-side routing API. `openRoute()` in place detail:

1. Reads `map_app_preferido` from `localStorage` or prompts sheet (Google / Apple / Waze).  
2. Opens provider URL with coordinates or address query.  
3. Logs `ir_agora` to `logs` table.

### Image storage

- **Buckets:** `lugares-fotos`, `rotas-fotos` (see `supabase/storage-policies.sql`)
- **Upload:** `lib/storageUpload.js` from admin forms
- **Public URLs** stored on place/route/profile records

---

## Security architecture (summary)

| Control | Implementation |
|---------|----------------|
| **RLS** | Required on production tables; repo versions policies for `perfis`, `logs`, and Storage — anonymous users read only public catalog data |
| **Server-side AI** | API keys never exposed to browser |
| **Usage integrity** | `increment_busca_ia` / `increment_roteiro_ia` as `SECURITY DEFINER` RPC |
| **Review moderation** | Public select policy on `status = aprovada` only |
| **Admin** | Role check in UI + RLS on mutations |
| **HTTPS** | Enforced by Vercel in production |

---

## Deployment topology

```text
GitHub (main)
    → Vercel build (npm run build)
        → Serverless functions (pages + /api/*)
        → Static assets (CDN)
    → Environment variables (Supabase + Anthropic)

Supabase project (us-west-2)
    → PostgreSQL
    → Auth
    → Storage CDN
```

Single-region deployment. No multi-region failover documented.

---

## Related documentation

- [Database schema & RLS](./database.md)
- [HTTP API reference](./api.md)
- [Feature matrix](./features.md)
- [Deployment runbook](./deployment.md)
