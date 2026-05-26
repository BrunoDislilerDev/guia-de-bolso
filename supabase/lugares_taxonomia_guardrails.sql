-- Garante coerência entre categoria e subcategoria na tabela `lugares`.
-- Regras:
-- 1) Se uma subcategoria existir em uma única categoria no catálogo canônico (`subcategorias`),
--    o banco corrige automaticamente `lugares.categoria` para essa categoria.
-- 2) Se a subcategoria for ambígua (ex.: "Bares"), mantém a categoria informada.
--
-- Rode no SQL Editor do Supabase (idempotente).

CREATE OR REPLACE FUNCTION public.sync_lugar_categoria_from_subcategoria()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  categoria_unica text;
BEGIN
  IF NEW.subcategoria IS NULL OR btrim(NEW.subcategoria) = '' THEN
    RETURN NEW;
  END IF;

  SELECT MIN(s.categoria)
  INTO categoria_unica
  FROM public.subcategorias s
  WHERE s.nome = NEW.subcategoria
  GROUP BY s.nome
  HAVING COUNT(DISTINCT s.categoria) = 1;

  IF categoria_unica IS NOT NULL THEN
    NEW.categoria := categoria_unica;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_lugar_categoria_from_subcategoria ON public.lugares;

CREATE TRIGGER trg_sync_lugar_categoria_from_subcategoria
BEFORE INSERT OR UPDATE OF categoria, subcategoria
ON public.lugares
FOR EACH ROW
EXECUTE FUNCTION public.sync_lugar_categoria_from_subcategoria();

-- Corrige dados já existentes com base no catálogo canônico.
UPDATE public.lugares l
SET categoria = canon.categoria
FROM (
  SELECT s.nome AS subcategoria, MIN(s.categoria) AS categoria
  FROM public.subcategorias s
  GROUP BY s.nome
  HAVING COUNT(DISTINCT s.categoria) = 1
) canon
WHERE l.subcategoria = canon.subcategoria
  AND l.categoria IS DISTINCT FROM canon.categoria;
