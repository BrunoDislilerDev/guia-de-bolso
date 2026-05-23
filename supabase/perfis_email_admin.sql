-- E-mail no perfil + leitura de todos os perfis para admin/dev.
-- IMPORTANTE: rode também perfis_rls_fix.sql (policy antiga com EXISTS em perfis causa recursão infinita).

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN perfis.email IS 'E-mail da conta (sync com auth.users no login).';

-- Policies de SELECT estão em perfis_rls_fix.sql (is_admin_or_dev + perfis_select_own).
