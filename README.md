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
- [x] Autenticação com Google via Supabase Auth
- [x] Página de login com redirecionamento automático
- [x] Avatar do usuário logado no header
- [x] Login via SMS com Twilio (OTP de 6 dígitos)
- [x] Login via SMS com Twilio funcionando
- [x] Novo visual da página de login (foto de fundo, painel verde escuro)
- [x] Novo visual da página de login com foto de fundo
- [x] Removido Apple Sign In (pendente Apple Developer Program)
- [x] Apple Sign In removido (pendente Apple Developer Program)
- [x] Fluxo de verificação com contador de reenvio e tratamento de erros
- [x] Carrossel de destaques na home com auto-scroll e dots
- [x] Sistema de planos (Básico, Padrão, Premium) com badges visuais
- [x] Temperatura real via OpenWeatherMap API
- [x] Geolocalização dinâmica com distância real calculada
- [x] Endereço estruturado com Google Places Autocomplete no admin
- [x] Tabela localizacoes separada com lat/lng
- [x] Subcategorias por categoria
- [x] Tags nos lugares com chips visuais
- [x] Tags incluídas no contexto da busca por IA
- [x] Cards com gradiente e altura mínima de 380px
- [x] Página de categoria com grid de lugares (`/categoria/[slug]`)
- [x] Filtro por subcategoria na página de categoria
- [x] Status aberto/fechado em tempo real
- [x] Carrossel de fotos na página de detalhe com chip 1/N
- [x] Botão de compartilhar no detalhe do lugar
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
- [x] Upload de foto de perfil funcionando
- [x] Tela de perfil sem login com benefícios e opções de entrada
- [x] Logout com confirmação
- [x] Excluir conta com confirmação estilo Apple/Google
- [x] Preferência de app de navegação salva no localStorage
- [x] Bottom sheet de login para conteúdo restrito
- [x] Onboarding com 3 telas
- [x] Painel admin completo (`/admin`)
- [x] Dashboard com analytics e logs em tempo real
- [x] Gestão de locais com status (ativo, desativado, em_analise)
- [x] Admin com seleção de subcategoria e tags
- [x] Moderação de avaliações (aprovar/rejeitar)
- [x] Gestão de destaques e planos
- [x] Gestão de destaques no painel admin
- [x] Gestão de usuários
- [x] Sistema de logs (login, logout, favoritos, IR AGORA, acesso ao app)
- [x] Sistema de avaliações com moderação
- [x] Editor de horários com time picker (toggles Fechado/24h)
- [x] Página de categorias (`/categorias`)
- [x] Novas categorias: Cultura, Aventura, Bem-estar, Compras
- [x] Tabela perfis com roles (user/admin)
- [x] 25 lugares cadastrados em 5 categorias
- [x] Imagens reais via Supabase Storage
- [x] Deploy automático na Vercel
- [x] Seção de Rotas com listagem e card destaque
- [x] Página de detalhe de rota com pontos do percurso
- [x] Skeleton de carregamento na listagem de rotas
- [x] CRUD completo de Rotas no painel admin
- [x] Admin de Lugares redesenhado com fotos, grid de cards e filtros
- [x] Upload de fotos real no admin (lugares e rotas) com preview e Supabase Storage
- [x] Mapa interativo no cadastro de lugares com marcador arrastável via Google Maps
- [x] Máscara de telefone (xx) x xxxx-xxxx no formulário de lugares
- [x] Tags filtradas por categoria no formulário de lugares
- [x] Sistema de roles expandido: dev, admin, usuario, estabelecimento
- [x] Dashboard admin redesenhado com cards de métricas e variação semanal
- [x] Logs com badges coloridos por ação e detalhes formatados
- [x] Campo distância removido do formulário de lugares (calculado no app)
- [x] Bloco de endereço movido para o final do formulário de lugares
- [x] Mapa com altura aumentada para 350px
- [x] Busca com histórico de visitados recentes (localStorage)
- [x] Seção "Populares agora" na tela de busca
- [x] Resultados de busca em tela isolada com skeleton e estado vazio
- [x] Animação de transição ao focar no campo de busca
- [x] Roteiro personalizado com IA (Claude API) dentro da tela de Rotas
- [x] Formulário guiado: dias, perfil e interesses
- [x] Loading animado com mensagens alternadas durante geração do roteiro
- [x] Roteiros salvos no banco e exibidos na tela de Rotas

---

## Próximos passos

### Essenciais
- [ ] Notificações Push (boas-vindas por geolocalização, promoções para quem favoritou)
- [ ] Busca por voz (Web Speech API + Claude API)
- [ ] Modo offline básico (PWA com service worker)
- [ ] QR Code do estabelecimento (cliente escaneia → perfil no app → avalia)

### Diferenciais
- [ ] "Estou aqui agora" — check-in com contagem de pessoas no lugar em tempo real
- [ ] Clima e condições da praia (ondas, vento, UV, bom para banho — dados INMET/Marinha)
- [ ] Eventos locais (tabela de eventos temporários integrada à home)

### Melhorias técnicas
- [ ] Dark mode completo (implementar com CSS variables quando o app estiver maduro)
- [ ] Dark mode no admin (painel administrativo em tema escuro)
- [ ] Apple Sign In (pós Apple Developer Program)
- [ ] WhatsApp Auth (pós aprovação Meta)
- [ ] Role "estabelecimento" com painel próprio

---

## Fluxo de desenvolvimento

```
Edita no Cursor → git push → Vercel atualiza automaticamente
```

Variáveis de ambiente precisam estar configuradas tanto no `.env.local` (local) quanto nas Environment Variables da Vercel (produção).

---

## Autor

Bruno Disliler — [brunodisliler.com](https://brunodisliler.com)