-- Tags de especialidade para Gastronomia → Empório Gourmet.
-- Idempotente — rode no SQL Editor do Supabase (após subcategoria_gastronomia_emporio_gourmet.sql).

ALTER TABLE tags ADD COLUMN IF NOT EXISTS icone text;
ALTER TABLE tags ADD COLUMN IF NOT EXISTS categorias jsonb DEFAULT '[]';
ALTER TABLE tags ADD COLUMN IF NOT EXISTS subcategorias jsonb DEFAULT '[]';

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Vinhos', '🍷', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Delicatessen', '🧀', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Empório gourmet', '🫒', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Vinhos importados', '🍾', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Cervejas artesanais', '🍺', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Chocolates importados', '🍫', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Presentes sofisticados', '🎁', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Tábuas de frios', '🥓', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Degustação', '🍷', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'),
  ('Experiência gastronômica', '✨', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- Garante vínculo Empório Gourmet se a tag já existir com outro escopo
UPDATE tags
SET subcategorias = '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'::jsonb,
    categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Vinhos',
  'Delicatessen',
  'Empório gourmet',
  'Vinhos importados',
  'Cervejas artesanais',
  'Chocolates importados',
  'Presentes sofisticados',
  'Tábuas de frios',
  'Degustação',
  'Experiência gastronômica'
)
AND (
  subcategorias IS NULL
  OR subcategorias = '[]'::jsonb
  OR NOT (subcategorias::text LIKE '%Empório Gourmet%')
);
