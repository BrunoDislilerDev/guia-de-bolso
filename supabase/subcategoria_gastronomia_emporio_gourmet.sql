-- Subcategoria Gastronomia → Empório Gourmet (delicatessen, gourmet, vinhos, queijos).
-- Rode no SQL Editor do Supabase (idempotente).

INSERT INTO subcategorias (categoria, nome, icone)
SELECT v.categoria, v.nome, v.icone
FROM (VALUES
  ('Gastronomia', 'Empório Gourmet', '🫒')
) AS v(categoria, nome, icone)
WHERE NOT EXISTS (
  SELECT 1 FROM subcategorias s
  WHERE s.categoria = v.categoria AND s.nome = v.nome
);

-- Tags úteis para emporiums (só vincula se a tag já existir no banco)
UPDATE tags
SET subcategorias = COALESCE(subcategorias, '[]'::jsonb) ||
  '[{"categoria":"Gastronomia","nome":"Empório Gourmet"}]'::jsonb,
    categorias = (
      SELECT jsonb_agg(DISTINCT elem ORDER BY elem)
      FROM (
        SELECT jsonb_array_elements_text(COALESCE(categorias, '[]'::jsonb)) AS elem
        UNION
        SELECT 'Gastronomia'
      ) x
    )
WHERE nome IN (
  'Comida local',
  'Produtos locais',
  'Aceita cartão',
  'Wi-Fi',
  'Estacionamento',
  'Acessível',
  'Delivery',
  'Encomendas'
)
AND NOT (COALESCE(subcategorias, '[]'::jsonb)::text LIKE '%Empório Gourmet%');
