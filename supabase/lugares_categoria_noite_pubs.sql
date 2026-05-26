-- Corrige lugares de vida noturna (pubs, baladas) classificados em Natureza ou outras categorias.
-- Rode no SQL Editor do Supabase (idempotente).

UPDATE lugares
SET
  categoria = 'Noite',
  subcategoria = COALESCE(NULLIF(TRIM(subcategoria), ''), 'Pubs')
WHERE categoria IS DISTINCT FROM 'Noite'
  AND (
    subcategoria IN ('Pubs', 'Pub', 'Baladas', 'Balada', 'Boate', 'Clube')
    OR nome ILIKE '%zimbeer%'
    OR nome ILIKE '%emporio%'
    OR nome ILIKE '%empório%'
    OR (nome ILIKE '%pub%' AND subcategoria IS NULL)
  );

-- Bares/choperias em Natureza (cadastro incorreto) → Noite
UPDATE lugares
SET
  categoria = 'Noite',
  subcategoria = 'Bares'
WHERE categoria = 'Natureza'
  AND subcategoria IN ('Bares', 'Bar', 'Choperia', 'Cervejaria');
