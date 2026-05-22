-- Corrige perfis com chave legada YYYY-MM ou dia diferente do corrente (SP).
-- Rode uma vez no SQL Editor de produção após deploy do alinhamento em lib/premiumServer.js.

UPDATE perfis
SET
  uso_ia_mes = to_char(timezone('America/Sao_Paulo', now()), 'YYYY-MM-DD'),
  buscas_ia = 0,
  roteiros_ia = 0
WHERE (premium_ativo IS NOT TRUE OR premium_ate IS NOT NULL AND premium_ate <= now())
  AND (
    uso_ia_mes ~ '^\d{4}-\d{2}$'
    OR uso_ia_mes IS DISTINCT FROM to_char(timezone('America/Sao_Paulo', now()), 'YYYY-MM-DD')
  );
