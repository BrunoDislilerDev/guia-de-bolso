-- Execute no SQL Editor do Supabase antes de usar o novo sistema de roles
ALTER TABLE perfis DROP CONSTRAINT IF EXISTS perfis_role_check;
ALTER TABLE perfis ADD CONSTRAINT perfis_role_check
  CHECK (role IN ('dev', 'admin', 'usuario', 'estabelecimento'));

-- Migração opcional: perfis com role legado 'user' → 'usuario'
UPDATE perfis SET role = 'usuario' WHERE role = 'user';
