# Guia de Bolso — Checklist de testes manuais (mobile)

Checklist para QA manual no celular (~390px). Complementa [Features](./features.md) e o guia de fluxos críticos abaixo.

**Dispositivo:** _______________  
**Data:** _______________  
**Build/URL:** _______________  
**Conta teste:** Guest / User free / Premium / Admin  

---

## Referência rápida — fluxos críticos

| Fluxo | Entrada principal | Restrição guest |
|-------|-------------------|-----------------|
| Login | `/login`, `LoginModal`, Perfil | — |
| Cadastro | Primeiro login (Google/SMS) + `/perfil/editar` | — |
| Busca IA | Home `SmartSearch`, `/?busca=1`, `/?q=` | Login + limite 3/dia (free) |
| Ver lugar | Cards → `/lugares/[id]` | Nenhuma |
| Favoritar | Coração home/detalhe, `/favoritos` | Login |
| Avaliar | Detalhe → `AvaliacaoForm` | Login; moderação admin |
| Roteiro IA | `/rotas` → Criar roteiro | Login + limite 2/dia (free) |
| Rotas curadas | `/rotas`, `/rotas/[id]` | Nenhuma (só listagem) |
| Clima | Hero home; `LugarClimaWidget` no detalhe | Sheet completo = login |
| Perfil | `/perfil`, `/perfil/editar` | Stats só logado |
| Admin | `/admin` + nav | `role` admin ou dev |

---

## A. Preparação

- [ ] App abre em produção ou `localhost` na rede do celular
- [ ] Limpar `localStorage` (ou aba anônima) para testar onboarding
- [ ] Ter 1 lugar **sem foto**, 1 **sem horário**, 1 **parceiro ativo**, 1 **praia Natureza com coords**
- [ ] Conta admin com `role = admin` no Supabase
- [ ] Migrations aplicadas se testar taxonomia/rotas/avaliações (`docs/database.md`)

---

## B. Onboarding e navegação

- [ ] Primeira visita: onboarding 3 telas → fechar → não reaparece ao recarregar
- [ ] Bottom nav: Início, Explorar, Rotas, Favoritos, Perfil — aba ativa correta
- [ ] `not-found`: URL inválida mostra 404 amigável

---

## C. Login e cadastro

### Google

- [ ] `/login` → Continuar com Google → volta logado na home
- [ ] Avatar/inicial no header da home
- [ ] `/login` já logado → redireciona para `/`
- [ ] Erro OAuth → `/login?error=auth`

### SMS

- [ ] Telefone inválido (< 11 dígitos) → mensagem de erro
- [ ] OTP correto → sucesso → home em ~1,5s
- [ ] OTP errado → limpa e mensagem
- [ ] OTP expirado → mensagem adequada
- [ ] Reenviar código (cooldown 30s); após 3 reenvios → bloqueio

### Cadastro (primeiro acesso)

- [ ] Conta nova consegue favoritar após login
- [ ] `/perfil/editar`: alterar nome e foto → persiste após reload
- [ ] Linha em `perfis` existe no Supabase (se algo falhar no perfil/admin)

---

## D. Home (`/`)

### Carregamento

- [ ] Seções carregam sem travar a página inteira
- [ ] Falha Supabase em hero ou “Em alta”: “Conteúdo indisponível” (não tela branca)

### Header e contexto

- [ ] Frase contextual (clima OK ou fallback)
- [ ] Temperatura no hero (`°C` ou `--°C`)

### O que fazer agora (hero)

- [ ] Card com foto, métricas 2×2, CTA EXPLORAR → detalhe
- [ ] Favoritar no hero (logado) / modal (guest)

### Parceiros

- [ ] Carrossel se houver destaque vigente (plano Parceiro)
- [ ] Sem destaques: carrossel omitido (sem erro)
- [ ] Card com badge parceiro → detalhe

### Em alta hoje

- [ ] Lista horizontal; scroll; abre detalhe
- [ ] Chip aberto/fechado só com `mostrar_horarios` + horários cadastrados

### Planos rápidos

- [ ] Tap dispara busca (logado) ou login (guest)

### Perto de você

- [ ] Loading próprio; depois cards
- [ ] Com GPS: distância coerente
- [ ] Sem GPS: lista aparece (ordem pode variar)

### Busca IA

- [ ] Guest: buscar → `LoginModal` (motivo `busca`)
- [ ] Logado: browse (recentes) ao focar campo vazio
- [ ] Busca com resultado → lista; toque abre lugar
- [ ] Busca sem resultado → mensagem clara
- [ ] Filtro Abertos / Fechados / Todos
- [ ] Contador `X/3 hoje` (free); 4ª busca → paywall + countdown
- [ ] `/?busca=1` (Explorar) abre busca após onboarding
- [ ] `/?q=praia` executa busca automática
- [ ] Parceiros priorizados / badge nos resultados

---

## E. Explorar (`/categorias`)

- [ ] Contagem total e por categoria
- [ ] Carrossel “Mais visitadas agora” (se houver dados)
- [ ] Atalhos de humor → home com busca (login se necessário)
- [ ] Barra “O que você procura?” → `/?busca=1`
- [ ] Grid de categorias → `/categoria/[slug]`
- [ ] `ExplorarSkeleton` no loading

---

## F. Categoria (`/categoria/[slug]`)

- [ ] Lista lugares `status = ativo`
- [ ] Chips subcategoria (se existirem)
- [ ] “Todos” restaura lista
- [ ] Erro Supabase → banner vermelho + voltar a `/categorias`
- [ ] Cards com distância (com GPS)

---

## G. Detalhe do lugar (`/lugares/[id]`)

### Geral

- [ ] Lugar ativo abre completo
- [ ] ID inválido / inativo → “Lugar não encontrado”
- [ ] Erro rede → `ErrorBanner` + Tentar novamente

### Mídia e conteúdo

- [ ] Sem foto: placeholder/gradiente aceitável
- [ ] Várias fotos: carrossel e indicador
- [ ] Parceiro: badge e visibilidade (galeria/descrição)
- [ ] Compartilhar: share nativo ou “Link copiado!”

### Estabelecimento vs público

- [ ] Restaurante: Ligar/Instagram/Cardápio/Site só com URL/telefone
- [ ] Praia/trilha: ações de info; sem menu fictício

### Horários e endereço

- [ ] Com horários + `mostrar_horarios`: badge e sheet
- [ ] Sem horários: sem badge “Abre…” enganoso
- [ ] `mostrar_endereco` false: sem mapa estático
- [ ] Mapa estático ou link fallback (sem API key)

### Clima (Natureza/Aventura + coords)

- [ ] Mini widget visível
- [ ] Guest: Ver mais → `LoginModal` (`clima`)
- [ ] Logado: `ClimaSheet` completo
- [ ] API clima fora: widget some/erro sem quebrar página

### Favoritar e avaliar

- [ ] Favoritar toggle (logado) / modal (guest)
- [ ] Avaliar: nota + aspectos + comentário
- [ ] Após enviar: toast; **não** na lista pública até aprovação
- [ ] Segunda avaliação bloqueada (`jaAvaliou`)
- [ ] Admin vê sugestão IA em `/admin/avaliacoes`

### Ir agora

- [ ] CTA fixo: sheet Google/Apple/Waze se sem preferência
- [ ] Preferência do perfil/localStorage reutilizada
- [ ] Abre app externo; log `ir_agora` (verificar em `/admin/logs`)

---

## H. Favoritos (`/favoritos`)

- [ ] Guest: CTA + login
- [ ] Logado com itens: lista; remover item (optimistic rollback se falhar)
- [ ] Logado vazio: empty state
- [ ] Erro fetch: banner + retry
- [ ] Lugar desativado some da lista

---

## I. Rotas (`/rotas` e `/rotas/[id]`)

### Lista

- [ ] Guest vê rotas curadas
- [ ] “Criar roteiro” → login se guest
- [ ] Chips de tipo filtram (se >1 tipo)
- [ ] Empty state se zero rotas

### Roteiro IA (logado)

- [ ] Formulário dias + perfil + interesses
- [ ] Geração → preview markdown
- [ ] Salvar → “Meus roteiros”
- [ ] Free: 2/dia; 3º → paywall + countdown
- [ ] Abrir roteiro salvo no modal

### Detalhe rota curada

- [ ] Capa, tags, tipo, dificuldade, duração
- [ ] Etapas: descrições ordenadas + dicas
- [ ] “Ver no guia” se etapa tem `lugar_id`
- [ ] Abrir no Maps (`rotas_localizacoes`)

---

## J. Perfil (`/perfil`, `/perfil/editar`)

- [ ] Guest: benefícios + login + continuar sem login
- [ ] Logado: hero, email, membro desde
- [ ] Stats: favoritos, avaliações, roteiros coerentes
- [ ] Card Premium / paywall
- [ ] App de navegação: trocar → reflete no detalhe
- [ ] Editar: nome + upload avatar (`imagens`)
- [ ] Logout com confirmação
- [ ] Excluir conta: confirma → desloga; log `deletou_conta` no admin

---

## K. Casos extremos

- [ ] Localização negada: home e detalhe usáveis
- [ ] Modo avião na home: seções degradam com mensagem
- [ ] Modo avião na busca IA: erro de rede claro
- [ ] Busca termo sem match
- [ ] Claude/API indisponível: busca/roteiro com mensagem de erro
- [ ] Guest bloqueado: favoritos, busca, avaliar, roteiro IA, clima sheet
- [ ] Onboarding antes de deep link `?busca=1` / `?q=`
- [ ] Meia-noite SP: contador IA renova (free)

---

## L. Admin (conta `admin` ou `dev`)

### Acesso e shell

- [ ] User comum em `/admin` → redirect `/`
- [ ] Sidebar desktop; drawer mobile; top bar com período (dashboard)
- [ ] Sino de alertas: links para avaliações, destaques, logs, etc.

### Dashboard (`/admin`)

- [ ] KPIs; alternar semana/mês
- [ ] Aprovar/rejeitar na fila inline
- [ ] Timeline de atividade
- [ ] Atalhos operacionais (logs, destaques expirando…)

### Locais (`/admin/locais`)

- [ ] Listar, criar, editar
- [ ] `EnderecoAutocomplete`: seleção sem reabrir dropdown
- [ ] Fotos; toggles `mostrar_endereco` / `mostrar_horarios`
- [ ] Tags (máx. 3) e subcategoria

### Rotas admin

- [ ] CRUD: tipo, tags rota, pontos, mapa, destaque

### Avaliações (`/admin/avaliacoes`)

- [ ] Pendentes; badge sugestão IA
- [ ] Aprovar → público no app; rejeitar → oculto

### Destaques (`/admin/destaques`)

- [ ] Plano Parceiro; vigência
- [ ] Novo vigente → home Parceiros + badge
- [ ] `?status=expirando` / `expirado`

### Usuários (`/admin/usuarios`)

- [ ] Role; premium IA
- [ ] Link logs `?user_id=`

### Logs (`/admin/logs`)

- [ ] Filtros ação, período, usuário
- [ ] Deep link lugar em `ir_agora`

### Taxonomia (`/admin/taxonomia`)

- [ ] CRUD subcategorias e tags
- [ ] Renomear com migração de lugares
- [ ] Excluir em uso → bloqueado
- [ ] `aplica_em_rotas` (após `rotas_taxonomia.sql`)

---

## M. Regressão pós-release (smoke)

Arquivos de alto impacto recentes: `app/page.js`, `lib/destaques.js`, `app/lugares/[id]/page.js`, `app/categorias/page.js`, `app/perfil/page.js`, `components/admin/*`, `lib/adminDashboard.js`.

- [ ] Home: hero → parceiros → em alta → planos → perto
- [ ] Busca: login + limite + parceiros no ranking
- [ ] Detalhe: horários, endereço, clima (não regrediu)
- [ ] Explorar → `/?busca=1`
- [ ] Perfil stats e logout
- [ ] Aprovação dashboard = mesma avaliação em `/admin/avaliacoes`

---

## Resultado

| Área | OK | Falhas |
|------|-----|--------|
| Login/Cadastro | | |
| Home/Busca | | |
| Explorar/Categoria | | |
| Detalhe | | |
| Favoritos | | |
| Rotas/IA | | |
| Perfil | | |
| Admin | | |
| Extremos | | |

**Bloqueadores:**  
_______________________________________________  

**Observações:**  
_______________________________________________  

---

## Related docs

- [Features](./features.md) — comportamento esperado por capability
- [Architecture](./architecture.md) — rotas e componentes
- [API](./api.md) — limites IA e endpoints
- [Deployment](./deployment.md) — smoke tests em produção
- [Changelog](./CHANGELOG.md) — o que mudou por versão
