-- Corrige perfis com chave legada YYYY-MM em uso_ia_mes (impedia reset diário na leitura).
-- Opcional: rode uma vez no SQL Editor após atualizar o app.

UPDATE perfis
SET
  uso_ia_mes = to_char(timezone('America/Sao_Paulo', now()), 'YYYY-MM-DD'),
  buscas_ia = 0,
  roteiros_ia = 0
WHERE uso_ia_mes ~ '^\d{4}-\d{2}$'
  AND (premium_ativo IS NOT TRUE OR premium_ate IS NOT NULL AND premium_ate <= now());
