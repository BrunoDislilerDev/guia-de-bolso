-- Índices fase 2 — taxonomia, destaques, avaliações, rotas, relatórios em logs.
-- Rode após db_indexes.sql. Validar em staging com EXPLAIN nas queries do admin.

-- Taxonomia e joins
CREATE INDEX IF NOT EXISTS idx_lugares_tags_lugar_id
  ON lugares_tags (lugar_id);

CREATE INDEX IF NOT EXISTS idx_lugares_tags_tag_id
  ON lugares_tags (tag_id);

CREATE INDEX IF NOT EXISTS idx_subcategorias_categoria_nome
  ON subcategorias (categoria, nome);

-- Destaques / parceiros
CREATE INDEX IF NOT EXISTS idx_destaques_lugar_id
  ON destaques (lugar_id);

CREATE INDEX IF NOT EXISTS idx_destaques_lugar_ativo
  ON destaques (lugar_id)
  WHERE ativo = true;

-- Avaliações (detalhe, moderação, "já avaliou")
CREATE INDEX IF NOT EXISTS idx_avaliacoes_user_lugar
  ON avaliacoes (user_id, lugar_id);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_lugar_created_aprovadas
  ON avaliacoes (lugar_id, created_at DESC)
  WHERE status IN ('aprovada', 'aprovado');

-- Rotas curadas
CREATE INDEX IF NOT EXISTS idx_rota_pontos_rota_ordem
  ON rota_pontos (rota_id, ordem);

-- Logs — filtro JSON em relatórios (até existir logs.lugar_id dedicado)
CREATE INDEX IF NOT EXISTS idx_logs_detalhes_gin
  ON logs USING gin (detalhes);
