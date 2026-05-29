-- Promove um usuário a Desenvolvedor com Premium ilimitado pelo e-mail de login.
-- Substitua o e-mail abaixo e rode no SQL Editor.
-- O trigger perfis_guard_privileged_columns bloqueia role/premium sem auth admin/dev;
-- desabilite-o temporariamente ou use o painel /admin/usuarios logado como admin.

ALTER TABLE perfis DISABLE TRIGGER perfis_guard_privileged_columns;

INSERT INTO perfis (id, nome, email, role, premium_ativo, premium_ate)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  'dev',
  true,
  NULL
FROM auth.users u
WHERE u.email = 'brunodislilerdev@gmail.com'
ON CONFLICT (id) DO UPDATE
SET
  role = 'dev',
  premium_ativo = true,
  premium_ate = NULL,
  email = EXCLUDED.email,
  nome = COALESCE(perfis.nome, EXCLUDED.nome);

ALTER TABLE perfis ENABLE TRIGGER perfis_guard_privileged_columns;
