-- Localização estruturada das rotas (1:1 com `rotas`), espelho de `localizacoes`.

CREATE TABLE IF NOT EXISTS rotas_localizacoes (
  rota_id uuid PRIMARY KEY REFERENCES rotas(id) ON DELETE CASCADE,
  rua text,
  numero text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  pais text DEFAULT 'Brasil',
  endereco_completo text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rotas_localizacoes_cidade_idx ON rotas_localizacoes (cidade);

ALTER TABLE rotas_localizacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read rotas_localizacoes" ON rotas_localizacoes;
CREATE POLICY "Public read rotas_localizacoes"
ON rotas_localizacoes FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM rotas r
    WHERE r.id = rotas_localizacoes.rota_id
      AND (COALESCE(r.ativa, true) = true OR public.is_admin_user())
  )
);

DROP POLICY IF EXISTS "Admin write rotas_localizacoes" ON rotas_localizacoes;
CREATE POLICY "Admin write rotas_localizacoes"
ON rotas_localizacoes FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());
