-- Escala da tabela `logs`: retenção e arquivamento (rodar via cron/pg_cron quando volume crescer).
-- Por ora: índice em db_indexes.sql; este script documenta política operacional.

-- Exemplo: apagar logs com mais de 18 meses (ajuste conforme LGPD)
-- DELETE FROM logs WHERE created_at < NOW() - INTERVAL '18 months';

-- Particionamento futuro (Postgres 15+):
-- CREATE TABLE logs_2026_05 PARTITION OF logs FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

COMMENT ON TABLE logs IS 'Analytics de produto; SELECT restrito a admin (logs_policies.sql). Arquivar/particionar acima de ~1M linhas.';
