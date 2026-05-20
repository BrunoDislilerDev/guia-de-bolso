# Changelog

All notable changes to **Guia de Bolso** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-05-20

### Added

- **`LugarClimaWidget`** on place detail (`/lugares/[id]`) for **Natureza** and **Aventura** places with coordinates — mini summary (temp, waves, bath status, wind) for all visitors; **`ClimaSheet`** with full Open-Meteo/marine metrics for **logged-in** users (login modal for guests).
- **`fetchClimaApisCached`** and **`lugarExibeClima`** in `lib/clima.js` (10-minute in-memory cache per coordinates).
- **Hero metrics grid (2×2)** on `OQueFazerAgora` — Distância, Tempo da experiência, regional **Temperatura** (from home climate fetch), **De carro** (drive-time estimate from distance at 30 km/h, rounded to 5 min).
- **Place visibility flags** on `lugares`: `mostrar_endereco`, `mostrar_horarios` (admin toggles; migration `supabase/lugares_visibilidade.sql`).
- **`getStorageErrorMessage`** in `lib/storageUpload.js` for clearer admin photo upload errors.

### Changed

- **Open/closed badges** on `EmAltaCard` and `PlaceCard` only when `mostrar_horarios` is true and `horarios` is a non-empty object (`getStatusFuncionamento` with optional second argument).
- **Place detail** — hours block gated by `mostrar_horarios`; address/map block by `mostrar_endereco` and non-empty address; establishment quick actions omit links without URLs; removed **`LugarPorQueIrAgora`** section.
- **Static map preview** on place detail uses **Google Maps Static API** (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) with clickable fallback when the image fails (`LugarLocalizacaoCard`).
- **Admin `LocalForm`** — address saved only via `localizacoes` (no `lugares.endereco` in payload); visibility checkboxes; improved save vs. photo error handling.
- **Profile** — “Notificações” setting row hidden until implemented.

### Fixed

- **Admin `EnderecoAutocomplete`** — dropdown no longer reopens after a confirmed selection; single-click selection (`lockedQueryRef`, focus-gated list, `onMouseDown` preventDefault).
- **`getMelhorHorario`** — returns `null` when the place has no registered hours (hero no longer shows misleading “Abre …” copy for beaches).

### Documentation

- Updated `docs/features.md`, `docs/architecture.md`, `docs/database.md`, and `docs/deployment.md` for climate-on-detail, hero metrics, visibility columns, Google Static Maps, and admin address behavior.

## [0.3.0] - 2026-05-19

### Added

- **Decision-oriented home** — contextual header (`HomeContextHeader`), expanded `SmartSearch`, hero “O que fazer agora” (`OQueFazerAgora`), “Em alta hoje”, preset “Planos rápidos”, and “Perto de você”; driven by `lib/homeContext.js`.
- **Conversion-focused place detail** — modular `components/lugar/*` (immersive hero, quick actions by venue type, compact hours, fixed navigation CTA); establishment vs. public-place logic in `lib/lugarDetalhe.js`.
- **`next/image`** for place cards, trending cards, search rows, lugar hero, and route covers; `images.remotePatterns` in `next.config.mjs` (Supabase Storage + picsum).
- **`PlaceCardSkeleton`** loading placeholders on favorites, category grids, and search results.
- **Visible error handling** — red `ErrorBanner` (`role="alert"`) on place detail, category listings, and favorites; gray `SectionUnavailable` per failed home section.
- **Design tokens** in `app/globals.css` (`--color-primary`, `--color-background`, `--color-muted`, etc.) and global `*:focus-visible` outline.
- **Accessibility** — `BottomNav` and search controls with `aria-label`; bottom sheets with `role="dialog"`, `aria-modal`, and `aria-labelledby`; semantic `<ul>` / `<li>` on place lists.
- **Empty states** — curated routes list (“Nenhuma rota cadastrada ainda”) and saved AI roteiros (“Nenhum roteiro salvo ainda”).
- **Technical documentation** under `docs/` (architecture, database, API, features, deployment, contributing) and restructured root `README.md`.
- **JSDoc** across `app/`, `components/`, `lib/`, and `middleware.js` (no runtime behavior change).

### Changed

- **Home data loading** — two phases (`Promise.allSettled`): primary (active places + trending) then secondary (nearby + weather); failures isolated per section instead of failing the whole page.
- **`/categorias`** — single `select("categoria")` with client-side counts (replaces nine per-category count queries).
- **Place/route cards** — ratings read from optional `rating_medio` / `media_avaliacoes` on the row only (removed per-card `avaliacoes` queries).
- **`/rotas` and `/rotas/[id]`** — aligned with app palette (`#f0f4f3`, `#1a4a3a`), `rounded-2xl` cards, higher-contrast difficulty labels.
- **Primary actions** — unified green CTAs (`#1a4a3a`) on hero, roteiro section, and route detail.
- **System dark mode** — `prefers-color-scheme: dark` overrides disabled until a full theme ships.
- **Touch targets** — minimum ~44px on smart-search and lugar hero icon buttons.

### Fixed

- **Silent Supabase failures** on home sections, favorites, category pages, and place detail — users now see retry or section-unavailable copy instead of empty UI.
- **Admin route form** — `saveError` banner when save fails.
- **`EnderecoMapPicker`** — “Mapa indisponível no momento” when the map cannot load.

### Documentation

- Updated `docs/features.md`, `docs/architecture.md`, and `docs/database.md` for home loading, error patterns, `next/image`, design tokens, and optional rating fields on `lugares`.

## [0.2.0] - 2026-05-19

### Added

- **Daily AI usage limits** for the free tier: 3 AI searches and 2 AI itineraries per calendar day (`America/Sao_Paulo`), resetting at midnight; Premium remains unlimited (R$ 9,90/mo).
- `DailyLimitCountdown` component — live `HH:MM:SS` until reset; used on home search, `/rotas` roteiro card, and `PremiumPaywallSheet`.
- `isSameUsageDay()` in `lib/premium.js` — matches `perfis.uso_ia_mes` as `YYYY-MM-DD` or legacy `YYYY-MM` buckets.
- `supabase/premium_uso_diario.sql` — documents daily semantics for `uso_ia_mes`.
- Technical documentation under `docs/` (`architecture`, `database`, `api`, `features`, `deployment`, `contributing`, index `README`).
- JSDoc across `app/`, `components/`, `lib/`, and `middleware.js` (no runtime behavior change).

### Changed

- **Monthly → daily** quota model: `uso_ia_mes` stores day key `YYYY-MM-DD`; RPCs `increment_busca_ia` / `increment_roteiro_ia` updated (`supabase/increment_uso_ia.sql`).
- `usePremiumUsage` — hydrates same-day cache from `localStorage` (`guia_premium_usage_{userId}`), then syncs via `GET /api/uso-premium` (server is source of truth); exposes `loading` and `synced`.
- Home search usage label: `IA X/3 hoje · renova à meia-noite`; inline countdown when daily search limit is reached.
- `/rotas` roteiro section: daily usage label, compact countdown when blocked (`Novos roteiros em HH:MM:SS`).
- `PremiumPaywallSheet` — daily-limit copy and countdown for `busca` / `roteiro` features.
- Root `README.md` — restructured (overview, stack, deployment, docs index).

### Fixed

- Usage counter showing **0/3** after page reload despite prior use — removed synthetic default from API/hook; hydrate cache before fetch.
- **Invisible countdown** on the dark roteiro card — compact timer inherits parent text color instead of fixed dark green.
- `GET /api/uso-premium` no longer falls back to empty usage on read errors (client keeps valid cache).

### Documentation

- Updated `docs/features.md`, `docs/architecture.md`, `docs/database.md`, and `docs/api.md` for daily limits and client sync behavior.

## [0.1.0] - 2026-05-18

### Added

- Initial production release: home, place detail, categories, auth (Google + SMS), favorites, reviews, admin panel, AI search and roteiros (Guia Premium with monthly-style usage counters), routes, and Vercel deploy.

[0.3.0]: https://github.com/BrunoDislilerDev/guia-de-bolso/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/BrunoDislilerDev/guia-de-bolso/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/BrunoDislilerDev/guia-de-bolso/releases/tag/v0.1.0
