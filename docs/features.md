# Features

User-facing product reference for **Guia de Bolso** (Imbituba, SC). Behavior is derived from the current codebase; implementation details live in [Architecture](./architecture.md) and [API](./api.md).

**Product question the app answers:** *“What should I do right now?”*

---

## Roles and access (summary)

| Role | Typical access |
|------|----------------|
| **Guest** | Browse places, categories, curated routes, place details; mini weather on outdoor detail; **no** AI search/roteiros; full `ClimaSheet` requires login |
| **Logged-in user** | Favorites, reviews, AI search (3/day), AI roteiros (2/day), saved roteiros, full outdoor weather sheet on place detail |
| **Premium** | Unlimited AI search & roteiros (weather on detail is login-gated, not premium-gated today) |
| **Admin / Dev** | CMS at `/admin` (`canAccessAdmin`: roles `admin`, `dev` only) |

---

## 1. First-run onboarding

**Description**  
A short multi-slide intro shown on the first visit, explaining discovery, favorites, and local context. Dismissal is remembered in the browser.

**User goal**  
Understand what the app does before exploring, without creating an account.

**Main flows**
1. User opens `/` for the first time → `Onboarding` overlay appears if `localStorage.onboarding_visto` is unset.
2. User swipes through slides → taps finish → key is set → home loads normally.
3. Returning visits skip onboarding.

**Edge cases**
- Clearing `localStorage` shows onboarding again.
- Onboarding waits until auth check finishes (`onboardingChecked`) to avoid flashing home then overlay.
- Works for guests and logged-in users alike.

---

## 2. Home — contextual header

**Description**  
Top bar with region label (Imbituba), a **time- and weather-aware phrase**, and avatar (login link or user photo).

**User goal**  
Feel the app is aware of “right now” (morning/afternoon/night, weather hints).

**Main flows**
1. Home loads → `fetchClimaApis` for Imbituba coordinates → `getFraseContextual(clima)` sets phrase.
2. Guest taps avatar area → `/login` or profile when logged in.

**Edge cases**
- Weather API failure → phrase falls back to time-of-day copy only; home may show a discreet gray line (“Conteúdo indisponível no momento”) when the climate request fails in the secondary load phase.
- Geolocation is **not** required for the header (fixed regional coords for climate).
- Phrase uses `America/Sao_Paulo` logic (aligned with opening hours).

---

## 3. Smart search (AI)

**Description**  
Natural-language search: user types or picks a chip; Claude ranks active places using category, tags, subcategory, and open/closed status.

**User goal**  
Find places matching intent (“romantic dinner”, “open now”, “sunset spot”) without browsing categories.

**Main flows**
1. User focuses search → browse panel may open (recent + popular).
2. User submits query (Enter or send) → must be **logged in** → client checks quota → `POST /api/buscar`.
3. Results panel shows ranked cards with favorite toggle; usage counter updates.
4. Quick chips (e.g. “Abertos agora”) set query + optional status filter and run search immediately.
5. **Planos rápidos** cards trigger the same search pipeline with preset queries/filters.

**Edge cases**
- **Guest** → `LoginModal` with motivo `busca`.
- **Daily limit reached** (3/day) → `PremiumPaywallSheet` (`busca`) with countdown; search panel may close. Inline `DailyLimitCountdown` while search is open.
- Empty catalog after status filter → API message, zero results.
- Network/API error → inline error string; optimistic UI not applied to results.
- Server returns `LOGIN_REQUIRED` / `LIMIT_REACHED` even if client pre-check passed (session/expiry race).
- Usage counter: hydrates from `localStorage` on same calendar day, then syncs via `GET /api/uso-premium` (server is source of truth). Shows “Carregando uso de IA…” until cache or API is ready — never a false `0/3` flash.
- When daily limit reached with search open: inline `DailyLimitCountdown` + paywall; label shows `X/3 hoje`.

---

## 4. Search — browse mode (no query yet)

**Description**  
Overlay when the search field is focused: **recently viewed** places (device) and **popular** places (favorites aggregate in DB).

**User goal**  
Resume exploration or pick a trending place without typing.

**Main flows**
1. Focus search → `searchMode = "browse"` → `SearchBrowsePanel` shows recent + popular.
2. Tap a row → navigate to `/lugares/[id]` (recent list updated on detail view).
3. Blur empty field → panel closes (with small delay to allow chip clicks).

**Edge cases**
- Recent list is **local only** (`lugares_visitados`, max 5) — not synced across devices.
- No favorites in DB → popular falls back to newest active places.
- Escape key closes full search overlay when in search mode.

---

## 5. Search — status filter (Todos / Abertos / Fechados)

**Description**  
Chip row to narrow AI search by real-time opening status (`lib/horarios.js`, Brazil timezone).

**User goal**  
Only see places that are open now (or intentionally closed).

**Main flows**
1. User selects filter → state `filtroBuscaStatus` updates.
2. On search, filter sent to API → pre-filters catalog before Claude → post-filters results.

**Edge cases**
- “Abertos” with no matching places → empty results + API message.
- Public beaches without `horarios` may classify as closed/open per parser defaults.
- Filter applies to AI path only, not to static home sections.

---

## 6. Home — “O que fazer agora” (hero suggestion)

**Description**  
Large hero card with one **contextual place**: photo, badges (e.g. trending), a **2×2 metrics grid** (distance, experience duration, regional temperature, estimated drive time), favorite, and **EXPLORAR** CTA to detail.

**User goal**  
Get a single strong recommendation without searching.

**Main flows**
1. Active places loaded → sorted by distance if GPS available → `pickHeroLugar` chooses one.
2. Secondary home load fetches Open-Meteo for Imbituba → `temperaturaClima` passed into the hero (shown as e.g. `23°C`, or `--°C` if unavailable).
3. **De carro** estimates minutes from parsed `distancia_calculada` at 30 km/h, rounded to the nearest 5 (`~5 min`, `~10 min`, …).
4. User taps card or CTA → `/lugares/[id]`.
5. User toggles favorite on hero (login required).

**Edge cases**
- No places / still loading → placeholder “Carregando sugestão…”.
- Supabase failure for active places → hero section replaced by gray `SectionUnavailable` (“Conteúdo indisponível no momento”), not a silent empty hero.
- Hero preference uses popularity set + proximity heuristics (`lib/homeContext.js`).
- Without GPS, distance may show static/legacy `distancia` text; drive-time block shows `—` when distance cannot be parsed to km.
- Hero does **not** show open/closed or “best time” chips (those appear on list cards only when hours are configured).

---

## 7. Home — Parceiros comerciais

**Description**  
Horizontal carousel of places with an **active commercial highlight** (`destaques` + plano Parceiro). Shown between the hero and “Em alta hoje”.

**User goal**  
Discover official partner businesses promoted in the guide.

**Main flows**
1. Home loads active places and vigent `destaques` → `ParceirosCarrossel` lists partner places with distance when GPS is available.
2. Partner cards show badge/tags via `ehParceiro`; tap → place detail.

**Edge cases**
- No active highlights → carousel omitted (not an error state).
- Same partner visibility rules apply in AI search and category cards (`lib/destaques.js`, `lib/lugarVisibilidade.js`).

---

## 8. Home — “Em alta hoje”

**Description**  
Horizontal list of popular places (by favorite count), with distance when GPS is available.

**User goal**  
See what others save most often.

**Main flows**
1. `fetchLugaresPopulares` → up to 8 cards → `EmAltaCard` with `next/image` (first card may use `priority` preload).
2. Star rating renders only when the place row includes `rating_medio` or `media_avaliacoes` (no per-card Supabase query).

**Edge cases**
- Ties / few favorites → fallback to recent active places.
- Popular fetch failure → `SectionUnavailable` for the section title “🔥 Em alta hoje”.
- Open/closed chip renders only when `mostrar_horarios` is true and `horarios` is non-empty (same rule as `PlaceCard`).
- Cards link to place detail; not the same algorithm as hero pick.

---

## 9. Home — “Planos rápidos”

**Description**  
Preset experience cards (morning, romantic afternoon, rainy day, nightlife, quick trip) that launch an AI search with a fixed query and filter.

**User goal**  
One-tap inspiration for common trip moods.

**Main flows**
1. Tap plan card → sets filter + runs `executarBusca(plano.query, plano.filtro)`.
2. Same login/quota/paywall rules as smart search.

**Edge cases**
- Requires login and search quota like any AI search.
- Does not create a saved roteiro — only search results.

---

## 10. Home — “Perto de você”

**Description**  
Bottom section listing nearby active places, sorted by calculated distance.

**User goal**  
Discover what is close right now.

**Main flows**
1. Loaded in a **secondary** home `useEffect` (after hero + trending) via `fetchLugaresProximos` → `sortLugaresPorDistancia` with GPS.
2. Tap card → place detail; first visible `PlaceCard` may use image `priority`.

**Edge cases**
- Geolocation denied/unavailable → order may be arbitrary; distance label weak or missing.
- Open/closed badge on `PlaceCard` follows the same `mostrar_horarios` + non-empty `horarios` rule as “Em alta”.
- Section shows its own loading copy while secondary fetch runs; fetch failure → `SectionUnavailable` (“Perto de você”).
- Complements hero/trending rather than replacing them.

---

## 11. Bottom navigation

**Description**  
Floating glass nav: **Início**, **Explorar** (`/categorias`), **Rotas**, **Favoritos**, **Perfil**.

**User goal**  
Move between main app areas with one thumb.

**Main flows**
1. Tap item → route change; active state from `pathname`.
2. Container uses `aria-label="Navegação principal"`; each link has an `aria-label` with the tab name.

**Edge cases**
- Hidden on some full-bleed flows only if page omits component (most consumer pages include it).
- `/categoria/[slug]` is reached from Explorar, not a nav tab.
- Interactive targets sized for touch (e.g. `h-11 w-11` on search controls elsewhere).

---

## 12. Category exploration (Explorar)

**Description**  
Dedicated **Explorar** screen at `/categorias`: sticky header with live totals, AI search entry (`ExplorarBuscaBar`), mood shortcuts (`ExplorarAtalhos`), featured category carousel (`ExplorarDestaqueCard`), and full category grid (`ExplorarCategoriaCard`). Catalog metadata in `lib/categorias.js`.

**User goal**  
Browse by type (Nature, Food, Night, etc.) when not using AI search.

**Main flows**
1. `/categorias` → **one** query `select("categoria, imagem_url, fotos")` on active `lugares`, counts + cover thumbnails aggregated client-side → tap → `/categoria/[slug]`.
2. Category page loads active places + `subcategorias` for slug; loading shows six `PlaceCardSkeleton` placeholders.
3. “Todos” or a subcategory chip filters client-side list.
4. `PlaceCard` → detail; geolocation sorts by distance when available.
5. Mood shortcut or search bar can deep-link to home AI search with a preset query (same login/quota rules as smart search).

**Edge cases**
- Invalid/empty slug → empty list after load.
- Supabase error on category grid → red `ErrorBanner` (“Não foi possível carregar os lugares”) with link back to `/categorias`.
- Subcategory chips only if rows exist in `subcategorias` for that category name.
- No login required for browsing.

---

## 13. Place detail

**Description**  
Conversion-focused page for a single active place: photo carousel, persuasion copy, quick actions, tags, optional hours, optional **weather widget** (outdoor categories), optional address/map, about, reviews, fixed navigation CTA.

**User goal**  
Decide to go now, contact the business, or navigate.

**Main flows**
1. Open `/lugares/[id]` → parallel load place, photos (`fotos` jsonb + `fotos_lugar`), location, tags, reviews, favorite/review state.
2. **Establishment** (restaurant, salon, etc.): open/closed badge on hero when hours apply; compact hours row + sheet when `mostrar_horarios`; Call / Instagram / Menu / Site only for fields with URLs.
3. **Public** (beach, trail, etc.): info chips via quick actions — no call/menu row.
4. **Outdoor** (`Natureza`, `Aventura` with lat/lng): `LugarClimaWidget` shows live summary; tap **Ver mais** → `ClimaSheet` if logged in, else `LoginModal` (`clima`).
5. **Address block** when `mostrar_endereco` and `localizacoes.endereco_completo` — static map (Google Maps Static API) or fallback link to Google Maps.
6. Tap fixed CTA → choose or use preferred maps app → external navigation + `ir_agora` log.
7. Favorite, share, submit review (logged in).

**Edge cases**
- Inactive or missing id → “Lugar não encontrado”.
- Supabase error loading place → full-page red `ErrorBanner` with “Tentar novamente” (`router.refresh()`).
- No photos → placeholder/gradient from `getCapaFromLugar`; hero uses `next/image` with descriptive `alt` (place name).
- No hours configured or `mostrar_horarios=false` → no compact hours row.
- No address or `mostrar_endereco=false` → no location card.
- Climate widget hidden if API fails (no error banner; section omitted).
- Hours, maps picker, climate sheet, and review sheets use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` tied to sheet titles.
- Reviews: only `aprovada` shown; user’s pending review shows “awaiting approval” UX via `jaAvaliou`.
- One review per user per place (second attempt blocked).
- `profiles` join failure → fallback query without author names.
- Share: `navigator.share` or clipboard copy; user canceling share is silent.
- Maps: first visit may open app picker sheet; preference stored in `localStorage`.
- Visit recorded to recent list on successful load.

---

## 14. Favorites

**Description**  
Per-user saved places synced in Supabase; available from home (toggle), detail, and `/favoritos`.

**User goal**  
Build a personal shortlist for the trip.

**Main flows**
1. Logged in → heart on cards/detail → `favoritos` insert/delete + log.
2. `/favoritos` lists active places (join or fallback two-step query); loading uses `PlaceCardSkeleton` rows.
3. Remove from list → delete row + optimistic UI revert on error.

**Edge cases**
- Guest on `/favoritos` → CTA + `LoginModal`.
- Fetch failure → red `ErrorBanner` with “Tentar novamente” (`router.refresh()`).
- Deactivated place drops from list (`lugares!inner` + `status=ativo`).
- Optimistic UI rollback if RLS/network fails.
- Favorite state on home resets when session ends.
- Place list rendered as semantic `<ul>` / `<li>`.

---

## 15. Reviews (ratings & comments)

**Description**  
Logged-in users submit 1–5 stars, optional **aspect chips** (category-aware via `lib/avaliacaoAspectos.js`), and optional comment. Claude pre-moderation runs via `POST /api/avaliacoes/analisar` and stores a hint on `sugestao_ia` for operators. Public list shows distribution, aspects, and recommendation summary after admin approval.

**User goal**  
Share experience and read social proof.

**Main flows**
1. Detail → “Avaliar” → `AvaliacaoForm` → insert `status: pendente` with `aspectos` jsonb → fire-and-forget AI analysis.
2. Approved reviews appear in `LugarAvaliacoesSection` with star histogram and aspect tags.
3. Admin approves/rejects with IA suggestion badge (see Admin CMS).

**Edge cases**
- Guest → `LoginModal` (`avaliar`).
- One review per user per place.
- Toast confirms submission; content hidden until approved.
- Aggregate rating on hero uses only approved reviews.
- AI analysis failure does not block submission; admin can still moderate manually.

---

## 16. Share place

**Description**  
Share current place URL via native share sheet or copy link.

**User goal**  
Send a place to friends or save for later.

**Main flows**
1. Hero share button → `navigator.share` or clipboard → toast “Link copiado!”.

**Edge cases**
- Non-HTTPS or unsupported share → clipboard path.
- User dismisses native share → no error shown.

---

## 17. Navigation (“Ir agora” / maps preference)

**Description**  
Open Google Maps, Apple Maps, or Waze with coordinates or address; optional default app.

**User goal**  
Start turn-by-turn navigation immediately.

**Main flows**
1. Place detail fixed CTA or location card → `openRoute`.
2. If no preference → bottom sheet to choose app → save `map_app_preferido`.
3. Profile → “App de navegação preferido” → same options.

**Edge cases**
- Missing coordinates → address-based URL query.
- Popup blockers may affect `window.open`.
- Preference is device-local (`localStorage`), not only `perfis.maps_preferido`.

---

## 18. Authentication

**Description**  
Sign-in via **Google OAuth** or **SMS OTP** (Brazil +55, 11 digits). Used on `/login`, profile (guest), and `LoginModal` for gated actions.

**User goal**  
Access favorites, reviews, AI features, and saved roteiros.

**Main flows**
1. **Google** → Supabase OAuth → `/auth/callback` → exchange code → log `login` → redirect home.
2. **SMS** → enter phone → OTP → verify → success → redirect home.
3. **Login page** `/login` → redirects to `/` if already sessioned.
4. **Modal** context subtitles vary by motivo (`favoritar`, `busca`, `avaliar`, `rotas`, `premium`, etc.).

**Edge cases**
- OAuth error → redirect `/login?error=auth`.
- SMS: invalid length blocked client-side; resend cooldown 30s; max 3 resends then wait message.
- Wrong/expired OTP → clear code + error message.
- Apple Sign-In / WhatsApp: **not implemented** (planned).
- Account deletion signs out and logs request — **does not** call Supabase admin delete API (manual follow-up implied).

---

## 19. Profile

**Description**  
`/perfil` uses modular `components/perfil/*`: guest benefits + inline `AuthFlow`, or logged-in hero (`PerfilHero`), live stats (`PerfilStats` — favorites, reviews, saved roteiros), quick links, Premium card, and grouped settings with bottom sheets.

**User goal**  
Manage identity, preferences, and session.

**Main flows**
1. Guest → benefit list + login + “Continuar sem login”.
2. Logged in → parallel Supabase counts for favorites, `avaliacoes`, and `roteiros`; edit profile link; nav app preference sheet; logout; delete.
3. Logout → confirm → `signOut` → log → home.

**Edge cases**
- **Notificações** row hidden until push notifications ship.
- Delete account: confirmation copy warns permanence; signs out and logs `deletou_conta` — does not call Supabase admin delete API (manual follow-up implied).

---

## 20. Edit profile

**Description**  
`/perfil/editar` — update display name and upload avatar to Storage (`imagens` bucket).

**User goal**  
Personalize account appearance.

**Main flows**
1. Load `perfis` nome/foto → edit → save upsert.
2. Photo upload → Storage → public URL → `perfis.foto_url` + `auth.updateUser` metadata.

**Edge cases**
- Requires session; unauthenticated users not routed here from profile edit link.
- Upload failure leaves partial state with error message.
- Upsert depends on RLS allowing own-row write.

---

## 21. Curated routes (admin-published trails)

**Description**  
Editorial routes at `/rotas` and `/rotas/[id]`: cover, **tipo de rota** (categorias fixas em `lib/rotas.js`), **tags** (subset compartilhado do catálogo), difficulty, duration, distance, ordered **pontos** (steps) with optional link to a **lugar**. Featured route highlighted; list page supports filter chips by route type.

**User goal**  
Follow a predefined trail or city walk with guidance.

**Main flows**
1. `/rotas` (server-rendered) lists routes with app palette (`#f0f4f3` / `#1a4a3a`); cover images via `next/image`; featured card if `destaque=true`; horizontal chips filter by route type when multiple categories exist.
2. Tap route → detail with category icon, tag chips, step list with **ordered description lines per point**, **ordered tips** at the bottom, and metrics.
3. Admin `RotaForm`: route type, tags, multiple descriptions per step (no place link), map start point, dicas.
4. No login required to **view** list/detail (public read).

**Edge cases**
- Empty DB → empty state (“Nenhuma rota cadastrada ainda”) with map illustration.
- Inactive routes (`ativa=false`) depend on RLS/query (admin manages).
- Distinct from AI **roteiros** on same page.
- Route cards use semantic list markup where applicable.

---

## 22. AI trip roteiro (personalized itinerary)

**Description**  
Multi-step form (days, traveler profile, interests) → Claude generates markdown itinerary → optional save to `roteiros`.

**User goal**  
Get a custom day-by-day plan for the region.

**Main flows**
1. `/rotas` → “Roteiro personalizado com IA” → login check → quota check → `RoteiroBottomSheet`.
2. Submit → `POST /api/roteiro` → display result → “Salvar” → `POST /api/roteiro/salvar`.
3. Saved list on `/rotas` → tap → read-only modal with `RoteiroContent`.

**Edge cases**
- Guest → login modal.
- No saved roteiros yet → empty state in `RoteiroSection` (“Nenhum roteiro salvo ainda”).
- Daily limit 2/day → paywall (`roteiro`) with countdown; compact `DailyLimitCountdown` on `/rotas` card when blocked (`Novos roteiros em HH:MM:SS`, light text on dark gradient).
- Usage counter: same hydrate → sync pattern as search (`usePremiumUsage`); label `X/2 roteiros gratuitos hoje`.
- Incomplete form blocked client-side.
- Save without login impossible (API 401).
- Escape disabled while loading/saving.
- Generation failure shows error in sheet.

---

## 23. Guia Premium (paywall)

**Description**  
Subscription at **R$ 9,90/mo** for **unlimited** AI search and roteiros (no daily cap). Free tier: **3 buscas + 2 roteiros per day**, resetting at **midnight** (`America/Sao_Paulo`). `PremiumPaywallSheet` explains the daily limit; `DailyLimitCountdown` shows time until reset (`HH:MM:SS`, updates every second).

**User goal**  
Understand the daily free quota, when it renews, or upgrade for unlimited use.

**Main flows**
1. Hit daily limit → paywall with feature copy (busca/roteiro) + countdown + plan benefits.
2. While blocked on home (search open) or `/rotas` → countdown visible before/at paywall.
3. “Assinar” / CTA → may open login if needed (`premium` motivo) — **payment not integrated** (Asaas planned).

**Edge cases**
- `premium_ativo` + `premium_ate` enforced server-side and in RPC.
- Paywall is informational today — no in-app purchase flow.
- Premium users see unlimited counters in UI (`null` remaining).
- Countdown (`DailyLimitCountdown`): ticks every second via `getMsUntilDailyReset()`; may seed from `usage.msUntilReset` after API/RPC. Compact mode on `/rotas` inherits parent text color (timer visible on dark card).
- Legacy `uso_ia_mes` (`YYYY-MM`) or a previous day’s key: UI shows **0/N** for the new day; server realigns counters on read/increment so limits are not blocked by stale rows. After quota is used, UI and API both show `used === limit`.

---

## 24. Geolocation & distance

**Description**  
Browser GPS used on home, category lists, and place detail to compute Haversine distance (`distancia_calculada`).

**User goal**  
Understand how far places are from current position.

**Main flows**
1. `getCurrentPosition` on mount (timeout 10s, cached 5 min).
2. `withDistanciaDinamica` / `getDistanciaLugar` format labels on cards and hero.

**Edge cases**
- Permission denied → static `distancia` field or no label.
- Places without `localizacoes` → weak distance/travel estimates.
- Public-place “travel time” chips use heuristics from distance text, not live traffic.

---

## 25. Opening hours & open/now status

**Description**  
Weekly `horarios` json on each place; real-time open/closed for establishments and AI filters.

**User goal**  
Know if a business is open before going.

**Main flows**
1. Detail shows badge + compact summary → tap → full week sheet.
2. AI search and filters use same parser (`America/Sao_Paulo`).

**Edge cases**
- Public nature spots may hide hours UI entirely (`isLugarEstabelecimento`).
- `fechado`, `24h`, and split ranges supported; malformed json → safe “closed”/unknown.
- Establishment CTA copy changes when closed (“Como chegar” vs “Ir agora”).

---

## 26. Loading states, errors & accessibility (cross-cutting)

**Description**  
Shared UX patterns from the UI/UX audit: resilient data loading, visible failures, skeleton placeholders, image optimization, and baseline accessibility.

**User goal**  
Understand when content failed vs. is empty; navigate with keyboard/screen readers; see fast above-the-fold images.

**Patterns**

| Pattern | Where | Behavior |
|---------|--------|----------|
| **SectionUnavailable** | Home (`app/page.js`) | Gray, non-alarming copy per failed section (“Conteúdo indisponível no momento”) |
| **ErrorBanner** | Place detail, category grid, favorites | Red `role="alert"` banner; optional retry or back link |
| **PlaceCardSkeleton** | Favorites, category list, search results | Pulse placeholders matching card height |
| **`next/image`** | `PlaceCard`, `EmAltaCard`, search rows, lugar hero, route covers | Remote hosts allowed in `next.config.mjs` (Supabase Storage, picsum) |
| **Design tokens** | `app/globals.css` | `--color-primary`, `--color-background`, etc.; system dark mode media query **disabled** until full theme ships |
| **Focus** | Global | `*:focus-visible` outline in brand green |
| **Dialogs** | Bottom sheets (detail, profile) | `role="dialog"`, `aria-modal`, labelled titles |

**Edge cases**
- Home loads in **two phases**: primary (`lugares` ativos + populares) then secondary (perto + clima); each phase uses `Promise.allSettled` so one failure does not block the other.
- Search network errors still use inline message in the results panel (unchanged).
- `OQueFazerAgora` hero still uses a plain `<img>` (not yet migrated to `next/image`).

---

## 27. Weather context

**Description**  
**Open-Meteo** (forecast + marine) via `lib/clima.js`.

| Surface | What users see |
|---------|----------------|
| **Home header** | Time/weather-aware phrase (`getFraseContextual`) |
| **Hero card** | Regional temperature in the 2×2 metrics grid (`temperaturaClima` from the same fetch) |
| **Place detail** | `LugarClimaWidget` for **Natureza** / **Aventura** with coordinates — mini summary for everyone; **`ClimaSheet`** (UV, waves chart, sea temp, moon) for **logged-in** users |
| **Not mounted** | `ClimaCard` beach picker on home (component exists; use detail widget instead) |

**User goal**  
Plan beach/outdoor time with local weather awareness at decision time (especially on place pages).

**Main flows**
1. Home secondary load → `fetchClimaApis(IMBITUBA_COORDS)` → phrase + hero temperature.
2. Outdoor place detail → `fetchClimaApisCached(lat, lng)` → widget; logged-in tap opens `ClimaSheet`.
3. Guest tap on widget → `LoginModal` with motivo `clima`.

**Edge cases**
- Climate fetch failure on home → neutral time-based phrases; hero shows `--°C`.
- Widget omitted on detail if marine/weather API fails (silent).
- `PremiumPaywallSheet` copy for `clima` exists but detail sheet is **login-gated**, not premium-gated in the current build.

---

## 28. Dedicated login page

**Description**  
Marketing-style `/login` with background photo and `AuthFlow` in a green panel.

**User goal**  
Sign in from a focused screen (bookmark, redirect, marketing link).

**Main flows**
1. Open `/login` → if session exists → redirect `/`.
2. Else show Google + SMS same as modal.

**Edge cases**
- Duplicate of auth capabilities in modal/profile; no unique provider.

---

## 29. Activity logging (user-visible impact: minimal)

**Description**  
Server/client inserts into `logs` for login, logout, favorites, `ir_agora`, app open, account deletion request (`deletou_conta`). Drives **`/admin`** summary and **`/admin/logs`**, not end-user UI.

**User goal**  
(N/A — operational/analytics.)

**Main flows**
- Transparent to users except network latency on fire-and-forget inserts.

**Edge cases**
- Log insert failure is swallowed (`console.error` only).

---

## Admin CMS (operators only)

Not for tourists. Requires `perfis.role` ∈ `admin`, `dev`.

| Area | Description | User goal (operator) |
|------|-------------|----------------------|
| Dashboard (`/admin`) | Hero greeting + operational summary; KPI cards (pending reviews, active places, live partners, new users, IR AGORA in period, places in review); work queue with approve/reject; operational shortcuts; activity timeline; week/month period toggle | Monitor health and clear the moderation queue |
| Locais (`/admin/locais`) | CRUD, photos, hours, tags, address autocomplete, `mostrar_endereco` / `mostrar_horarios` toggles | Keep catalog accurate |
| Rotas | CRUD, steps, featured flag | Publish trails |
| Avaliações | Approve/reject pending; deep links from alerts (`?tab=`) | Moderate UGC |
| Destaques | Single commercial plan (Parceiro); vigência dates; `?status=expirando` \| `expirado` | Run paid highlights |
| Usuários | Roles, Premium IA status, engagement sheet; link to user logs | Access control |
| Logs (`/admin/logs`) | Filter by action, period, user (`?user_id=`); deep links to place edit | Investigate behavior |
| Taxonomia (`/admin/taxonomia`) | CRUD `subcategorias` (per fixed category) and `tags` (`categorias` jsonb, `aplica_em_rotas`); block delete when in use; migrate places on rename | Maintain catalog vocabulary without SQL |

**Edge cases**
- Client-side gate only — misconfigured RLS could block writes.
- Admin nav: sidebar on desktop (`lg+`), drawer on tablet/phone; bell shows cross-page alerts (not a substitute for `/admin/logs`).
- Dashboard uses `showPageHeading={false}` — title/subtitle live in `DashboardHero`, not the shell heading block.
- Primary CMS path is `/admin/locais`; `/admin/lugares` re-exports the same grid (legacy URL, not in nav).
- Taxonomia requires `rotas_taxonomia.sql` for `tags.aplica_em_rotas` and `rotas_tags`; app degrades gracefully if the column is missing.
- Address is stored in `localizacoes` only; run `lugares_visibilidade.sql` if visibility toggles fail to save.
- `EnderecoAutocomplete` locks the search field after selection so the dropdown does not reopen on the same text.
- Destaques form casts ids with `Number()` — must match DB id types (uuid vs serial).

---

## Planned / not in app (roadmap)

| Feature | Status |
|---------|--------|
| Apple Sign-In | Removed pending Apple Developer Program |
| WhatsApp Auth | Waiting Meta approval |
| Asaas billing & establishment self-service portal | Documented in business model, not built |
| Legacy multi-plan destaques carousel | Replaced by **Parceiros** carousel (`ParceirosCarrossel`) for vigent highlights only |
| In-app notifications | Profile row placeholder only |
| `ClimaCard` on home | Component exists; weather on detail via `LugarClimaWidget` instead |

---

## Feature → route index

| Feature | Primary routes |
|---------|----------------|
| Home assistant | `/` |
| Smart search | `/` (overlay) |
| Categories | `/categorias`, `/categoria/[slug]` |
| Place detail | `/lugares/[id]` |
| Favorites | `/favoritos` |
| Curated routes | `/rotas`, `/rotas/[id]` |
| AI roteiro | `/rotas` (sheet) |
| Profile | `/perfil`, `/perfil/editar` |
| Login | `/login`, modal, `/auth/callback` |
| Admin | `/admin`, `/admin/logs`, `/admin/taxonomia`, … |

---

## Related docs

- [Architecture](./architecture.md)
- [Database](./database.md)
- [API](./api.md)
- [Deployment](./deployment.md)
