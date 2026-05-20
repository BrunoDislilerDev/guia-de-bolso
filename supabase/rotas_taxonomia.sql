-- Taxonomia de rotas: tags compartilhadas, categorias fixas no app, vínculo opcional com lugares.

ALTER TABLE tags ADD COLUMN IF NOT EXISTS aplica_em_rotas boolean NOT NULL DEFAULT false;

UPDATE tags SET aplica_em_rotas = true WHERE nome IN (
  'Familiar',
  'Ideal para iniciantes',
  'Ideal para crianças',
  'Grátis',
  'Vista panorâmica',
  'Instagramável',
  'Pouco movimentado',
  'Trilha curta',
  'Trilha longa',
  'Trilha acessível',
  'Acesso apenas por trilha',
  'Camping permitido',
  'Com guia',
  'Sem guia necessário',
  'Histórico',
  'Reserva necessária',
  'Para experientes',
  'Escondido',
  'Cenário único',
  'Sem infraestrutura',
  'Estrada de terra',
  'Só de carro'
);

-- lugares.id é bigint no projeto de produção (não uuid)
ALTER TABLE rota_pontos ADD COLUMN IF NOT EXISTS lugar_id bigint REFERENCES lugares(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS rotas_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rota_id uuid NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
  tag_id integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE (rota_id, tag_id)
);

CREATE INDEX IF NOT EXISTS rotas_tags_rota_id_idx ON rotas_tags (rota_id);
CREATE INDEX IF NOT EXISTS rotas_tags_tag_id_idx ON rotas_tags (tag_id);
CREATE INDEX IF NOT EXISTS rota_pontos_lugar_id_idx ON rota_pontos (lugar_id);

ALTER TABLE rotas_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read rotas_tags" ON rotas_tags;
CREATE POLICY "Public read rotas_tags"
ON rotas_tags FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated write rotas_tags" ON rotas_tags;
CREATE POLICY "Authenticated write rotas_tags"
ON rotas_tags FOR ALL TO authenticated
USING (true)
WITH CHECK (true);
