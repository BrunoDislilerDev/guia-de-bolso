-- Tags de especialidade culinária para Gastronomia → Restaurantes.
-- Subcategoria = tipo do estabelecimento; tags = o que o restaurante serve / se destaca.
-- Idempotente — rode no SQL Editor do Supabase (produção e staging).
-- Complementa: tags_subcategorias.sql, tags_subcategorias_expansao.sql
-- (Rodízio, Frutos do mar, Comida local, Cozinha regional, Vegano/Vegetariano já existem)

ALTER TABLE tags ADD COLUMN IF NOT EXISTS icone text;
ALTER TABLE tags ADD COLUMN IF NOT EXISTS categorias jsonb DEFAULT '[]';
ALTER TABLE tags ADD COLUMN IF NOT EXISTS subcategorias jsonb DEFAULT '[]';

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Pizza', '🍕', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Sushi', '🍣', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Hambúrguer', '🍔', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Churrasco', '🥩', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Massas', '🍝', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha italiana', '🇮🇹', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha japonesa', '🇯🇵', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha mexicana', '🌯', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha árabe', '🧆', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha chinesa', '🥡', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Cozinha indiana', '🍛', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Por kilo', '⚖️', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Prato feito', '🍱', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Crepe e panquecas', '🥞', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Galeteria', '🍗', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- Garante vínculo Restaurantes em tags culinárias já existentes (se estiverem só na categoria)
UPDATE tags
SET subcategorias = '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'::jsonb,
    categorias = '["Gastronomia"]'::jsonb
WHERE nome IN ('Rodízio', 'Comida de rua', 'Self-service')
  AND (
    subcategorias IS NULL
    OR subcategorias = '[]'::jsonb
    OR NOT (subcategorias::text LIKE '%Restaurantes%')
  );
