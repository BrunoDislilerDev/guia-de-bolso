-- Leitura pública das tabelas usadas no select da home (joins).
-- Rode junto com lugares_public_read.sql se embed falhar para usuários logados.

ALTER TABLE localizacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read localizacoes" ON localizacoes;
CREATE POLICY "Public read localizacoes"
  ON localizacoes
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lugares AS l
      WHERE l.id = localizacoes.lugar_id
        AND l.status = 'ativo'
    )
  );

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read tags" ON tags;
CREATE POLICY "Public read tags"
  ON tags
  FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE lugares_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read lugares_tags" ON lugares_tags;
CREATE POLICY "Public read lugares_tags"
  ON lugares_tags
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lugares AS l
      WHERE l.id = lugares_tags.lugar_id
        AND l.status = 'ativo'
    )
  );
