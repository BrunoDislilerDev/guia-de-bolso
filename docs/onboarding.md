# Onboarding técnico

Guia para desenvolvedores, DevOps e QA que entram no **Guia de Bolso**. Leia nesta ordem no primeiro dia.

---

## Dia 0 — Acesso e ambiente

| Item | Ação |
|------|------|
| Repositório | Clone `https://github.com/BrunoDislilerDev/guia-de-bolso` |
| Node.js | **20+** (`node -v`) |
| Supabase | Solicite convite ao projeto `rsdjbqzjdyeaedyqwrvc` (região `us-west-2`) ou use fork + projeto próprio |
| Anthropic | Chave de API para testar busca IA e roteiro localmente |
| Vercel | Opcional — acesso ao projeto de deploy para variáveis de Preview/Production |

```bash
git clone https://github.com/BrunoDislilerDev/guia-de-bolso.git
cd guia-de-bolso
npm install
cp .env.example .env.local
# Preencha conforme docs/environment.md
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## Dia 1 — Leitura obrigatória

```text
README (raiz)           → visão do produto e links
docs/README.md          → índice completo
docs/project-structure.md
docs/architecture.md    → stack, rotas, integrações
docs/authentication.md  → OAuth, SMS, sessão
docs/data-flows.md      → onde os dados passam
docs/api.md             → contratos HTTP
docs/database.md        → tabelas e RLS
docs/migrations.md      → ordem dos SQL em /supabase
docs/conventions.md     → como escrever código aqui
docs/environment.md     → variáveis e escopos
```

**Arquivos de contexto para agentes de IA (não substituem a docs):**

- [`CLAUDE.md`](../CLAUDE.md) — regras de negócio e stack resumida
- [`AGENTS.md`](../AGENTS.md) — Next.js 16 (consultar `node_modules/next/dist/docs/` antes de mudar APIs)

---

## Dia 2 — Banco e permissões

1. No **Supabase SQL Editor**, aplique scripts na ordem do [manifesto de migrations](./migrations.md#manifest).
2. Crie seu usuário (Google ou SMS em `/login`).
3. Promova-se a admin **apenas em ambiente de dev**:

```sql
UPDATE perfis SET role = 'admin' WHERE id = '<seu-auth.users.id>';
```

4. Valide:
   - Home com lugares ativos
   - `/admin` após login
   - RLS: leitura anônima de `lugares` com `status = 'ativo'`

Documentação de segurança: [`security-rls.md`](./security-rls.md), [`../SECURITY_CHECKLIST.md`](../SECURITY_CHECKLIST.md).

---

## Dia 3 — Fluxos críticos para testar

| Fluxo | Rota / ação | O que validar |
|-------|-------------|---------------|
| Catálogo público | `/`, `/categorias` | Lugares `ativo`, sem login |
| Busca IA | Home → busca (logado) | `POST /api/buscar`, contador 5/dia |
| Detalhe | `/lugares/[id]` | Horários, mapa, favorito (login) |
| Roteiro IA | `/rotas` | `POST /api/roteiro`, limite 2/dia |
| Auth Google | `/login` | Redirect `/auth/callback` |
| Auth SMS | `/login` | OTP Twilio via Supabase |
| Admin CMS | `/admin/locais` | CRUD + upload Storage |
| Health deploy | `GET /api/health` | `{ ok: true }` |

Checklist manual completo: [`TESTING-CHECKLIST.md`](./TESTING-CHECKLIST.md) e [`/checklist-testes.html`](../public/checklist-testes.html).

---

## Comandos do dia a dia

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor local |
| `npm run build` | Obrigatório antes de PR |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários `lib/*.test.js` |
| `npm run test:e2e` | Playwright (`e2e/smoke.spec.js`) |

CI no GitHub: `.github/workflows/ci.yml` (lint, test, build em PRs para `main`).

---

## Onde mexer por tipo de tarefa

| Tarefa | Começar em |
|--------|------------|
| Nova tela consumidor | `app/`, `components/{domínio}/` |
| Regra de negócio | `lib/` |
| Endpoint com segredo / IA | `app/api/` |
| Policy ou tabela | `supabase/*.sql` + `docs/migrations.md` |
| Limite Premium / IA | `lib/premiumServer.js`, RPC `increment_*_ia` |
| Copy pt-BR centralizada | `lib/userMessages.js` |
| Admin | `app/admin/`, `components/admin/`, guard em `app/admin/layout.js` |

---

## Staging e preview

- Deploy preview: Vercel gera URL por PR — configure redirect em Supabase Auth.
- Guia dedicado: [`staging.md`](./staging.md).

---

## Contatos e governança

- Issues: [GitHub Issues](https://github.com/BrunoDislilerDev/guia-de-bolso/issues)
- Contribuição: [`contributing.md`](./contributing.md)
- Segurança: [`../SECURITY.md`](../SECURITY.md)
- Maintainer: Bruno Disliler — [brunodisliler.com](https://brunodisliler.com)

---

## Próximo passo após onboarding

Implemente uma correção pequena (typo, teste, doc) e abra um PR seguindo o checklist em [`contributing.md`](./contributing.md#pull-request-checklist).
