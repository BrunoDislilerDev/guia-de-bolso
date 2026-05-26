-- Rota do dia: fixação opcional no admin (substitui uso de rotas.destaque no app).
-- Rode no SQL Editor do Supabase após as migrações de rotas.

ALTER TABLE rotas
  ADD COLUMN IF NOT EXISTS rota_do_dia_fixada_ate date;

COMMENT ON COLUMN rotas.rota_do_dia_fixada_ate IS
  'Último dia (inclusivo, fuso America/Sao_Paulo) em que a rota substitui a rotação diária automática.';

-- Legado: destaque manual não é mais usado pelo app (rotação + fixação).
COMMENT ON COLUMN rotas.destaque IS
  'Legado — substituído por rota_do_dia_fixada_ate + rotação diária no app.';
