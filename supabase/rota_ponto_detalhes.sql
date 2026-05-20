-- Detalhes ordenados de cada ponto do percurso (várias descrições por ponto).

CREATE TABLE IF NOT EXISTS rota_ponto_detalhes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ponto_id uuid NOT NULL REFERENCES rota_pontos(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 1,
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rota_ponto_detalhes_ponto_id_idx ON rota_ponto_detalhes (ponto_id);

ALTER TABLE rota_ponto_detalhes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read rota_ponto_detalhes" ON rota_ponto_detalhes;
CREATE POLICY "Public read rota_ponto_detalhes"
ON rota_ponto_detalhes FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM rota_pontos p
    JOIN rotas r ON r.id = p.rota_id
    WHERE p.id = rota_ponto_detalhes.ponto_id
      AND (COALESCE(r.ativa, true) = true OR public.is_admin_user())
  )
);

DROP POLICY IF EXISTS "Admin write rota_ponto_detalhes" ON rota_ponto_detalhes;
CREATE POLICY "Admin write rota_ponto_detalhes"
ON rota_ponto_detalhes FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());
