-- Promove um usuário a admin pelo e-mail de login.
-- Substitua o e-mail abaixo e rode no SQL Editor (bypass RLS).

-- Bruno (exemplo do projeto)
-- UPDATE perfis SET role = 'admin', email = 'brunodislilerdev@gmail.com'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'brunodislilerdev@gmail.com');

INSERT INTO perfis (id, nome, email, role)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  'admin'
FROM auth.users u
WHERE u.email = 'brunodislilerdev@gmail.com'
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin',
  email = EXCLUDED.email,
  nome = COALESCE(perfis.nome, EXCLUDED.nome);
