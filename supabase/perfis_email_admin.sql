-- E-mail no perfil + leitura de todos os perfis para admin/dev.
-- Rode no SQL Editor após perfis_premium_policies.sql

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN perfis.email IS 'E-mail da conta (sync com auth.users no login).';

DROP POLICY IF EXISTS "perfis_select_admin" ON perfis;

CREATE POLICY "perfis_select_admin"
  ON perfis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis AS p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'dev')
    )
  );
