-- Retenção de locais inativos: exclusão definitiva após 30 dias.
-- Alertas no admin: 7 e 1 dia(s) antes (lib/adminAlertas.js + cron diário).
-- Idempotente — rode no SQL Editor do Supabase.

ALTER TABLE lugares
  ADD COLUMN IF NOT EXISTS desativado_em timestamptz;

COMMENT ON COLUMN lugares.desativado_em IS
  'Preenchido quando status passa a desativado; limpo ao reativar. Base para purge após 30 dias.';

CREATE OR REPLACE FUNCTION public.sync_lugar_desativado_em()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'desativado'
    AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'desativado') THEN
    NEW.desativado_em := COALESCE(NEW.desativado_em, now());
  ELSIF NEW.status IS DISTINCT FROM 'desativado' THEN
    NEW.desativado_em := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_lugar_desativado_em ON public.lugares;

CREATE TRIGGER trg_sync_lugar_desativado_em
BEFORE INSERT OR UPDATE OF status, desativado_em
ON public.lugares
FOR EACH ROW
EXECUTE FUNCTION public.sync_lugar_desativado_em();

-- Locais já desativados antes da migration: conta retenção a partir do cadastro
UPDATE public.lugares
SET desativado_em = created_at
WHERE status = 'desativado'
  AND desativado_em IS NULL;
