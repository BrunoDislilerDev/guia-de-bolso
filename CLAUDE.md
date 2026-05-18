# CLAUDE.md — Guia de Bolso

Este arquivo fornece contexto completo do projeto para o agente de IA. Leia antes de qualquer modificação.

---

## Sobre o projeto

**Guia de Bolso** é um app de descoberta local para Garopaba e Imbituba, Santa Catarina, Brasil. Permite que moradores e turistas encontrem praias, restaurantes, trilhas e serviços da região com busca por linguagem natural via IA, rotas detalhadas e navegação integrada.

**URLs:**
- Produção: https://guia-de-bolso-puce.vercel.app
- Repositório: https://github.com/BrunoDislilerDev/guia-de-bolso

---

## Stack completa

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Estilização | Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| IA | Claude API (claude-sonnet-4-20250514) |
| SMS Auth | Twilio (a implementar) |
| Deploy | Vercel |
| Editor | Cursor |
| Linguagem | JavaScript (sem TypeScript) |

---

## Variáveis de ambiente

Arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://rsdjbqzjdyeaedyqwrvc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
ANTHROPIC_API_KEY=sk-ant-...
```

As mesmas variáveis estão configuradas na Vercel em Production.

---

## Estrutura do projeto

```
guia-de-bolso/
├── app/
│   ├── page.js                  # Home page (Client Component)
│   ├── layout.js                # Layout global
│   ├── login/
│   │   └── page.js              # Tela de login (Google + Apple + SMS)
│   ├── auth/
│   │   └── callback/
│   │       └── route.js         # Callback OAuth do Supabase
│   ├── lugares/
│   │   └── [id]/
│   │       └── page.js          # Página de detalhe de cada lugar
│   ├── rotas/
│   │   ├── page.js              # Lista de rotas (requer login)
│   │   └── [id]/
│   │       └── page.js          # Detalhe de cada rota com etapas
│   ├── perfil/
│   │   └── page.js              # Perfil do usuário + configurações
│   ├── categorias/
│   │   └── page.js              # Grid de categorias e subcategorias
│   ├── admin/
│   │   ├── page.js              # Dashboard admin
│   │   ├── lugares/page.js      # CRUD de lugares
│   │   ├── avaliacoes/page.js   # Moderação de avaliações
│   │   ├── rotas/page.js        # Gestão de rotas
│   │   ├── destaques/page.js    # Gestão de destaques e planos
│   │   └── usuarios/page.js     # Gestão de usuários
│   └── api/
│       └── buscar/
│           └── route.js         # API route para busca com IA
├── lib/
│   └── supabase.js              # Cliente Supabase (SSR)
├── components/
│   ├── Onboarding.js            # Telas de onboarding (3-4 slides)
│   ├── LoginModal.js            # Modal de login para conteúdo restrito
│   ├── DestaqueCarrossel.js     # Carrossel de destaques da semana
│   ├── BotaoIrAgora.js          # Botão que abre Maps preferido
│   └── AvaliacaoCard.js         # Card de avaliação de um lugar
├── public/
├── .env.local                   # Variáveis de ambiente (não commitado)
├── CLAUDE.md                    # Este arquivo
├── AGENTS.md                    # Instruções para agentes de IA
└── README.md                    # Documentação do projeto
```

---

## Banco de dados Supabase

**Project ID:** rsdjbqzjdyeaedyqwrvc
**Region:** us-west-2

### Tabelas existentes

**`lugares`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária automática |
| nome | text | Nome do lugar |
| descricao | text | Descrição curta |
| categoria | text | Natureza, Gastronomia, Noite, Serviços, Hospedagem |
| distancia | text | Ex: "2.3km de você" (estático por enquanto) |
| imagem_url | text | URL da imagem (Supabase Storage ou Picsum) |
| destaque | bool | legado — será substituído pela tabela destaques |
| created_at | timestamp | Automático |

### Tabelas a criar

**`categorias`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| nome | text | Ex: Natureza |
| icone | text | Emoji ou nome do ícone |
| cor | text | Hex da cor do chip |

**`subcategorias`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| categoria_id | uuid | FK → categorias |
| nome | text | Ex: Praias, Trilhas, Cachoeiras |

**`perfis`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | = auth.users.id |
| nome | text | Nome do usuário |
| foto_url | text | URL da foto de perfil |
| role | text | user, admin |
| maps_preferido | text | google, apple, waze |
| created_at | timestamp | Automático |

**`avaliacoes`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| lugar_id | uuid | FK → lugares |
| user_id | uuid | FK → auth.users |
| nota | int | 1 a 5 estrelas |
| comentario | text | Texto da avaliação |
| status | text | pendente, aprovada, rejeitada |
| created_at | timestamp | Automático |

**`rotas`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| lugar_id | uuid | FK → lugares (opcional) |
| titulo | text | Nome da rota |
| descricao | text | Descrição geral |
| dificuldade | text | fácil, médio, difícil |
| tempo_estimado | text | Ex: "45 minutos" |
| imagem_capa | text | URL da imagem de capa |
| created_at | timestamp | Automático |

**`etapas_rota`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| rota_id | uuid | FK → rotas |
| ordem | int | Sequência da etapa |
| descricao | text | Instrução da etapa |
| foto_url | text | Foto opcional da etapa |

**`planos`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| nome | text | Básico, Padrão, Premium |
| frequencia | text | 2x semana, diário, diário premium |
| preco | numeric | Valor em reais |

**`destaques`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| lugar_id | uuid | FK → lugares |
| plano_id | uuid | FK → planos |
| data_inicio | date | Início do destaque |
| data_fim | date | Fim do destaque |
| ativo | bool | Controle manual pelo admin |

**`favoritos`**
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| user_id | uuid | FK → auth.users |
| lugar_id | uuid | FK → lugares |
| created_at | timestamp | Automático |

---

## Features implementadas ✅

- [x] Home page mobile-first com layout fiel ao design original
- [x] Chips de categoria com scroll horizontal (Natureza, Gastronomia, Noite, Serviços, Hospedagem)
- [x] Card de destaque da semana
- [x] Seção "Perto de você" com cards horizontais
- [x] Bottom navigation bar (Início, Favoritos, Perfil)
- [x] Filtro por categoria funcional
- [x] Página de detalhe de cada lugar (/lugares/[id])
- [x] Busca por linguagem natural com Claude API
- [x] 25 lugares cadastrados em 5 categorias
- [x] Imagem real da Praia da Vila via Supabase Storage
- [x] Autenticação com Google via Supabase Auth
- [x] Autenticação com Apple via Supabase Auth
- [x] Página de login com redirecionamento automático
- [x] Avatar do usuário logado no header
- [x] Cards com gradiente e altura mínima de 380px
- [x] Página de categoria com grid de lugares (`/categoria/[slug]`)
- [x] Status aberto/fechado em tempo real
- [x] Carrossel de fotos na página de detalhe com chip 1/N
- [x] Ações rápidas no detalhe (Ligar, Instagram, Cardápio, Site)
- [x] Horários de funcionamento com bottom sheet completo
- [x] Seção Localização com link para Google Maps
- [x] Seção Sobre com "Leia mais"
- [x] Botão IR AGORA com escolha de app (Google Maps, Apple Maps, Waze)
- [x] Favoritos reais salvos no Supabase
- [x] Página de favoritos com remoção de favoritos
- [x] Bottom nav com navegação ativa por rota
- [x] Página de perfil com foto, nome, email e estatísticas
- [x] Editar perfil com upload de foto para Supabase Storage
- [x] Tela de perfil sem login com benefícios e opções de entrada
- [x] Logout com confirmação
- [x] Excluir conta com confirmação estilo Apple/Google
- [x] Preferência de app de navegação salva no localStorage
- [x] Bottom sheet de login para conteúdo restrito
- [x] Onboarding com 3 telas
- [x] Deploy automático na Vercel

---

## Roadmap completo 🗺️

### Semana 1
- [ ] Login via SMS (Twilio + Supabase Auth)

### Semana 3
- [ ] Subcategorias (Natureza → Praias, Trilhas, Cachoeiras)
- [ ] Filtro por subcategoria

### Semana 4
- [ ] Avaliações com nota (1-5 estrelas) e comentário
- [ ] Usuário autenticado avalia uma vez por lugar
- [ ] Status de moderação (pendente → aprovada/rejeitada)
- [ ] Exibir apenas avaliações aprovadas nos lugares

### Semana 5
- [ ] Seção Rotas (/rotas) — requer login
- [ ] Detalhe de cada rota com etapas e fotos (/rotas/[id])
- [ ] Upload de fotos por etapa via Supabase Storage

### Semana 6
- [ ] Destaques como carrossel na home
- [ ] Lógica de planos (Básico 2x/semana, Padrão diário, Premium diário destacado)

### Semana 7 — Painel Admin (/admin)
- [ ] Rota protegida (role = admin no perfil)
- [ ] Dashboard com analytics (lugares mais vistos, avaliações pendentes, usuários)
- [ ] CRUD completo de lugares com upload de imagem
- [ ] Moderação de avaliações (aprovar/rejeitar)
- [ ] Gestão de rotas e etapas
- [ ] Gestão de destaques e planos
- [ ] Lista e gestão de usuários

### Semana 8 — Polish
- [ ] Temperatura real via API de clima (OpenWeatherMap)
- [ ] Geolocalização real para calcular distâncias
- [ ] Imagens reais para todos os lugares
- [ ] SEO e meta tags por página
- [ ] WhatsApp Auth via Twilio (requer aprovação Meta)

---

## Regras de acesso

| Conteúdo | Sem login | Com login |
|---|---|---|
| Ver lugares | ✅ | ✅ |
| Ver destaques | ✅ | ✅ |
| Busca por IA | ✅ | ✅ |
| Favoritar | ❌ → modal login | ✅ |
| Avaliar | ❌ → modal login | ✅ |
| Seção Rotas | ❌ → modal login | ✅ |
| Painel Admin | ❌ | ✅ (role=admin) |

---

## Design

**Paleta de cores:**
- Fundo: `#f0f4f3` (cinza clarinho)
- Verde escuro: `#1a4a3a` (botões, bottom nav, título)
- Verde menta: chip Natureza
- Bege: chip Gastronomia
- Lilás: chip Noite
- Azul claro: chip Serviços
- Dourado: chip Hospedagem

**Layout:** mobile-first, máximo ~390px de largura, centralizado no desktop

---

## Fluxo de desenvolvimento

```
Edita no Cursor → git add . → git commit -m "mensagem" → git push → Vercel atualiza automaticamente
```

**Nunca commitar o `.env.local`** — já está no `.gitignore`.

---

## Contexto do desenvolvedor

- **Nome:** Bruno Disliler
- **Background:** 4+ anos de Bubble.io (Tech Lead no WriteHuman.ai, Senior Dev no Athlytic.io)
- **Objetivo:** transição de carreira para Full Stack Developer com especialização em produtos AI-powered
- **Portfólio:** brunodisliler.com
- **GitHub:** github.com/BrunoDislilerDev
- **Este projeto é o projeto-escola da transição** — cada feature nova ensina um conceito do stack

---

## Notas importantes

- O projeto usa **JavaScript puro** (sem TypeScript) por decisão do desenvolvedor
- A busca por IA usa **todos os lugares do banco** como contexto para a Claude decidir quais retornar
- O campo `distancia` é texto estático por enquanto — geolocalização real vem depois
- O campo `destaque` na tabela lugares é legado — a lógica de destaques migrará para a tabela `destaques`
- O Apple Sign-In pode precisar de ajustes no Apple Developer Console
- A Vercel precisa ter todas as env vars configuradas em Production
- O painel Admin deve ser protegido por role = 'admin' no perfil do usuário
- Avaliações só aparecem para o usuário após aprovação pelo admin