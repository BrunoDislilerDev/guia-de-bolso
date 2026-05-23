-- Leitura pública de lugares ativos (app + Vercel com anon key).
-- Rode no SQL Editor se o app em produção retorna lista vazia ou erro de permissão.

ALTER TABLE lugares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active lugares" ON lugares;
CREATE POLICY "Public read active lugares"
  ON lugares
  FOR SELECT
  TO anon, authenticated
  USING (status = 'ativo');

-- Admin vê todos os status (cadastro / moderação)
DROP POLICY IF EXISTS "Admin read all lugares" ON lugares;
CREATE POLICY "Admin read all lugares"
  ON lugares
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis AS p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'dev')
    )
  );
