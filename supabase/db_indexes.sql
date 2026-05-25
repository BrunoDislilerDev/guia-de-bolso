-- Índices fase 1 — listagens, favoritos, logs e relatórios.
-- Fase 2: db_indexes_phase2.sql. Ordem: docs/migrations.md#manifest
-- Rode uma vez no SQL Editor (CONCURRENTLY não disponível no editor — ok em janela de manutenção).

CREATE INDEX IF NOT EXISTS idx_lugares_status_categoria
  ON lugares (status, categoria);

CREATE INDEX IF NOT EXISTS idx_favoritos_user_id
  ON favoritos (user_id);

CREATE INDEX IF NOT EXISTS idx_favoritos_lugar_id
  ON favoritos (lugar_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_favoritos_user_lugar_unique
  ON favoritos (user_id, lugar_id);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_lugar_status
  ON avaliacoes (lugar_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_localizacoes_lugar_id
  ON localizacoes (lugar_id);

CREATE INDEX IF NOT EXISTS idx_logs_created_at_desc
  ON logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_logs_acao_created_at
  ON logs (acao, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_destaques_ativo_periodo
  ON destaques (ativo, data_inicio, data_fim);

CREATE INDEX IF NOT EXISTS idx_roteiros_user_created
  ON roteiros (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_perfis_premium
  ON perfis (premium_ativo, premium_ate);
