-- Limite diário de IA (substitui contagem mensal na coluna uso_ia_mes).
-- A coluna uso_ia_mes passa a armazenar YYYY-MM-DD (fuso America/Sao_Paulo).
-- Opcional: pode rodar antes ou depois de increment_uso_ia.sql (apenas documenta a coluna).

COMMENT ON COLUMN perfis.uso_ia_mes IS 'Chave do dia de uso IA (YYYY-MM-DD, America/Sao_Paulo). Nome legado da coluna.';
