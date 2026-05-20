-- Dicas ordenadas por rota (admin CRUD; leitura pública no app).

CREATE TABLE IF NOT EXISTS rota_dicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rota_id uuid NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 1,
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rota_dicas_rota_id_idx ON rota_dicas (rota_id);

ALTER TABLE rota_dicas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read rota_dicas" ON rota_dicas;
CREATE POLICY "Public read rota_dicas"
ON rota_dicas FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated write rota_dicas" ON rota_dicas;
CREATE POLICY "Authenticated write rota_dicas"
ON rota_dicas FOR ALL TO authenticated
USING (true)
WITH CHECK (true);
