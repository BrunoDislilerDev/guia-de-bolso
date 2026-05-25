# Variáveis de ambiente

Referência única para configuração local, Vercel e CI. Template versionado: [`.env.example`](../.env.example).

**Nunca** commitar `.env.local` ou chaves reais.

---

## Resumo rápido

| Variável | Obrigatória | Escopo | Onde configurar |
|----------|:-----------:|--------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Build + runtime | Vercel Production/Preview, `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Build + runtime | Idem — chave **anon/publishable**, não `service_role` |
| `ANTHROPIC_API_KEY` | Sim* | Runtime server | Vercel, `.env.local` |
| `ANTHROPIC_MODEL` | Recomendado | Runtime server | Default no código: `claude-sonnet-4-5` |
| `NEXT_PUBLIC_SITE_URL` | Opcional | Build | URL canônica (QR, links absolutos) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Opcional | Build | Admin Places + mapa estático no detalhe |
| `SUPABASE_SERVICE_ROLE_KEY` | Opcional | Runtime server | Guest feedback, logs QR — **nunca** `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SENTRY_DSN` | Opcional | Build | Observabilidade (`lib/observability.js`) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | Opcional | Build | Legado; clima principal usa Open-Meteo |

\* Obrigatória para features de IA em produção; build CI pode usar secret placeholder se só validar compilação.

---

## Escopos Next.js

| Prefixo | Quando é lido | Implicação |
|---------|---------------|------------|
| `NEXT_PUBLIC_*` | **Build time** no bundle do cliente | Alterar na Vercel exige **novo deploy** |
| Sem prefixo | **Runtime** em Route Handlers e Server Components | Redeploy após mudança na Vercel |

O projeto valida presença de `NEXT_PUBLIC_SUPABASE_*` no build (`next.config.mjs`) para evitar deploy sem backend.

---

## Detalhamento por variável

### `NEXT_PUBLIC_SUPABASE_URL`

- URL do projeto: `https://<project-ref>.supabase.co`
- Produção: ref `rsdjbqzjdyeaedyqwrvc`, região `us-west-2`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- Chave pública com **RLS ativo**
- Usada em: browser client, server client com cookies, `getAnonServerClient()` em `/api/lugares`

### `ANTHROPIC_API_KEY`

- Rotas: `/api/buscar`, `/api/roteiro`, `/api/avaliacoes/analisar`
- **Proibido** expor ao browser

### `ANTHROPIC_MODEL`

- Ex.: `claude-sonnet-4-5`, `claude-sonnet-4-20250514`
- Sobrescreve default em cada route se definida

### `NEXT_PUBLIC_SITE_URL`

- Base para URLs em PDF/QR quando request não traz `origin`
- Local: `http://localhost:3000`
- Produção: `https://guia-de-bolso-puce.vercel.app`

### `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

- **Places API** — autocomplete no admin (`EnderecoAutocomplete`)
- **Maps Static API** — preview no detalhe (`getStaticMapUrl`)
- Sem chave: UI degrada para link Maps sem imagem estática

### `SUPABASE_SERVICE_ROLE_KEY`

- Bypassa RLS — uso mínimo:
  - `POST /api/feedback` para visitantes
  - `GET /q/[slug]` log `escaneou_qr`
- Apenas em `app/api/**` ou Route Handlers isolados
- **Nunca** importar em `"use client"`

### `NEXT_PUBLIC_SENTRY_DSN`

- Quando preenchido, erros podem ser enviados via `reportError()` (evolução contínua)

---

## Arquivo local

```bash
cp .env.example .env.local
```

Exemplo mínimo funcional:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-5

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Vercel

**Settings → Environment Variables**

| Ambiente | Recomendação |
|----------|--------------|
| **Production** | Projeto Supabase de produção + Anthropic produção |
| **Preview** | Mesmo Supabase ou projeto staging isolado; adicionar URLs de callback no Supabase |
| **Development** | Opcional (CLI `vercel env pull`) |

Após alterar variáveis: **Redeploy** (Deployments → Redeploy).

### Sintoma: “Supabase não configurado no deploy”

- `NEXT_PUBLIC_*` ausentes no **build** da Vercel
- Corrigir env e redeploy

---

## GitHub Actions (CI)

Secrets em **Repository → Settings → Secrets**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (opcional)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

---

## Supabase Dashboard (não são env do Next)

Configurar no painel Supabase, não no `.env.local`:

| Configuração | Onde |
|--------------|------|
| Google OAuth Client ID/Secret | Authentication → Providers |
| Twilio SMS | Authentication → Phone |
| Site URL + Redirect URLs | Authentication → URL Configuration |
| Storage buckets | Storage + SQL policies em `/supabase` |

Redirect produção: ver [`authentication.md`](./authentication.md).

---

## Segurança

| ❌ Nunca | ✅ Sempre |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE` | Service role só server, sem prefixo |
| Commitar `.env.local` | Usar `.env.example` como documentação |
| Mesma service role em preview público aberto | Projeto Supabase separado para PRs externos |

---

## Referências

- [`deployment.md`](./deployment.md)
- [`api.md`](./api.md#environment-variables-api)
- [`onboarding.md`](./onboarding.md)
