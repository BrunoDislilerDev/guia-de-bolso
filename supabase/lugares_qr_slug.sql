-- QR short links: slug column on lugares + backfill for eligible establishments.
-- Run in Supabase SQL Editor after deploy.

CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE lugares
  ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS lugares_slug_unique_idx
  ON lugares (slug)
  WHERE slug IS NOT NULL;

COMMENT ON COLUMN lugares.slug IS 'Short URL segment for /q/{slug} (eligible categories only).';

CREATE OR REPLACE FUNCTION public.guia_slugify(raw text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(
    left(
      trim(both '-' FROM regexp_replace(
        lower(regexp_replace(unaccent(coalesce(raw, '')), '[^a-zA-Z0-9]+', '-', 'g')),
        '-+',
        '-',
        'g'
      )),
      80
    ),
    ''
  );
$$;

DO $$
DECLARE
  r RECORD;
  base_slug text;
  final_slug text;
  counter int;
BEGIN
  FOR r IN
    SELECT id, nome
    FROM lugares
    WHERE categoria NOT IN ('Natureza', 'Aventura')
      AND slug IS NULL
    ORDER BY id
  LOOP
    base_slug := coalesce(guia_slugify(r.nome), 'local-' || r.id::text);
    final_slug := base_slug;
    counter := 2;

    WHILE EXISTS (SELECT 1 FROM lugares WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter::text;
      counter := counter + 1;
    END LOOP;

    UPDATE lugares SET slug = final_slug WHERE id = r.id;
  END LOOP;
END $$;
