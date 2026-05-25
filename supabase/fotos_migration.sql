-- Colunas jsonb para múltiplas fotos
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS fotos jsonb DEFAULT '[]';
ALTER TABLE rotas ADD COLUMN IF NOT EXISTS fotos jsonb DEFAULT '[]';

-- Migração opcional: imagem legada → array fotos
UPDATE lugares
SET fotos = jsonb_build_array(imagem_url)
WHERE (fotos IS NULL OR fotos = '[]'::jsonb)
  AND imagem_url IS NOT NULL
  AND imagem_url <> '';

UPDATE rotas
SET fotos = jsonb_build_array(COALESCE(foto_capa, imagem_capa))
WHERE (fotos IS NULL OR fotos = '[]'::jsonb)
  AND COALESCE(foto_capa, imagem_capa) IS NOT NULL
  AND COALESCE(foto_capa, imagem_capa) <> '';

-- Crie os buckets públicos no Storage: lugares-fotos, rotas-fotos
-- Leitura pública + escrita admin: rode storage_admin_fotos.sql (não use policies abertas abaixo).

CREATE POLICY "Public read lugares fotos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'lugares-fotos');

CREATE POLICY "Public read rotas fotos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'rotas-fotos');
