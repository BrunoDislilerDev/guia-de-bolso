-- Corrige tipo de retorno: lugares.id e favoritos.lugar_id são bigint em produção.
-- Rode após lugares_populares_rpc.sql (substitui a função com CREATE OR REPLACE).

CREATE OR REPLACE FUNCTION public.lugares_populares_ids(p_limit int DEFAULT 8)
RETURNS TABLE (lugar_id bigint, favoritos_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT f.lugar_id, COUNT(*)::bigint AS favoritos_count
  FROM favoritos AS f
  WHERE f.lugar_id IS NOT NULL
  GROUP BY f.lugar_id
  ORDER BY favoritos_count DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 8), 50));
$$;

REVOKE ALL ON FUNCTION public.lugares_populares_ids(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lugares_populares_ids(int) TO anon, authenticated;
