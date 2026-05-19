# Changelog

All notable changes to **Guia de Bolso** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[0.2.0]: https://github.com/BrunoDislilerDev/guia-de-bolso/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/BrunoDislilerDev/guia-de-bolso/releases/tag/v0.1.0
