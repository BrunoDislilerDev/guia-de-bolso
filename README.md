# Guia de Bolso 🌿

App de descoberta local para Garopaba e Imbituba — Santa Catarina, Brasil.

Permite que moradores e turistas encontrem praias, restaurantes e atrações da região com uma experiência mobile-first, limpa e intuitiva.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Estilização | Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL + Storage) |
| IA | Claude API (Anthropic) |
| Deploy | Vercel |
| Editor | Cursor |
| Controle de versão | Git + GitHub |

---

## Como rodar localmente

**Pré-requisitos:** Node.js, Git

```bash
# 1. Clonar o repositório
git clone https://github.com/BrunoDislilerDev/guia-de-bolso.git
cd guia-de-bolso

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
ANTHROPIC_API_KEY=sua_chave_aqui
ANTHROPIC_MODEL=claude-sonnet-4-5

# 4. Rodar em desenvolvimento
npm run dev
```

Acessa em `http://localhost:3000`.

---

## Banco de dados

Projeto usa Supabase com a seguinte tabela principal:

**Tabela: `lugares`**

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária automática |
| nome | text | Nome do lugar |
| descricao | text | Descrição curta |
| categoria | text | Natureza, Gastronomia, Noite, Serviços, Hospedagem |
| distancia | text | Ex: "2.3km de você" |
| imagem_url | text | URL da imagem |
| destaque | bool | Aparece como destaque da semana |
| created_at | timestamp | Automático |

---

## O que já foi construído

- [x] Setup completo do ambiente (Node, Git, Cursor)
- [x] Projeto Next.js com Tailwind CSS
- [x] Home page mobile-first com layout fiel ao design original
- [x] Chips de categoria com scroll horizontal (Natureza, Gastronomia, Noite, Serviços, Hospedagem)
- [x] Card de destaque da semana
- [x] Seção "Perto de você" com cards horizontais
- [x] Bottom navigation bar
- [x] Integração com Supabase
- [x] Dados sendo buscados dinamicamente do banco
- [x] Filtro por categoria funcional
- [x] Página de detalhe de cada lugar (`/lugares/[id]`)
- [x] Busca por linguagem natural com Claude API
- [x] Autenticação com Google e Apple via Supabase Auth
- [x] Página de login com redirecionamento automático
- [x] Avatar do usuário logado no header
- [x] 25 lugares cadastrados em 5 categorias
- [x] Imagens reais via Supabase Storage
- [x] Deploy automático na Vercel

---

## Próximos passos

- [ ] Login via SMS (Twilio)
- [ ] Favoritos por usuário autenticado
- [ ] Temperatura real via API de clima
- [ ] Geolocalização real para calcular distâncias
- [ ] Imagens reais para todos os lugares

---

## Fluxo de desenvolvimento

```
Edita no Cursor → git push → Vercel atualiza automaticamente
```

Variáveis de ambiente precisam estar configuradas tanto no `.env.local` (local) quanto nas Environment Variables da Vercel (produção).

---

## Autor

Bruno Disliler — [brunodisliler.com](https://brunodisliler.com)