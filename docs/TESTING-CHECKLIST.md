# Guia de Bolso — Checklist de testes manuais

Checklist para QA manual (celular ~390px, tablet e desktop). Complementa [Features](./features.md).

## Checklist interativo (recomendado)

Use a ferramenta com **145 casos de teste**, passo a passo por dispositivo, resultado esperado, avisos e botões **Passou / Falhou / Resetar**:

**[Abrir checklist interativo](/checklist-testes.html)**  
(produção: `https://guia-de-bolso-puce.vercel.app/checklist-testes.html` · local: `http://localhost:3000/checklist-testes.html`)

- Contador global no topo (total, passou, falhou, pendente) e barra de progresso
- Estado salvo no navegador (`localStorage`, chave `guia_checklist_v1`)
- **Exportar resultado** gera tabela por área + lista de falhas + JSON (cole em Bloqueadores/Observações abaixo)
- Dados editáveis: `public/checklist-testes.data.json` (gerar com `node scripts/build-checklist-data.mjs`)

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

## Seções do checklist (índice)

| Seção | Tema | Itens |
|-------|------|-------|
| A | Preparação | 5 |
| B | Onboarding e navegação | 3 |
| C | Login e cadastro | 12 |
| D | Home (`/`) | 24 |
| E | Explorar (`/categorias`) | 6 |
| F | Categoria (`/categoria/[slug]`) | 5 |
| G | Detalhe do lugar | 25 |
| H | Favoritos | 5 |
| I | Rotas e roteiro IA | 13 |
| J | Perfil | 8 |
| K | Casos extremos | 8 |
| L | Admin | 25 |
| M | Smoke pós-release | 6 |

---

## Resultado (após exportar da página HTML)

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
_(cole aqui o bloco “BLOQUEADORES” do export)_

**Observações:**  
_______________________________________________  

---

## Related docs

- [Features](./features.md) — comportamento esperado por capability
- [Architecture](./architecture.md) — rotas e componentes
- [API](./api.md) — limites IA e endpoints
- [Deployment](./deployment.md) — smoke tests em produção
- [Changelog](./CHANGELOG.md) — o que mudou por versão
