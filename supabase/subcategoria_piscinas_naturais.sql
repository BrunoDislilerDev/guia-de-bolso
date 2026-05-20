-- Subcategoria Natureza: Piscinas naturais
-- Rode no SQL Editor do Supabase (idempotente).

INSERT INTO subcategorias (categoria, nome, icone)
SELECT 'Natureza', 'Piscinas naturais', '💧'
WHERE NOT EXISTS (
  SELECT 1
  FROM subcategorias
  WHERE categoria = 'Natureza'
    AND nome = 'Piscinas naturais'
);
