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
-- Depois rode as policies abaixo:

CREATE POLICY "Auth upload lugares fotos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lugares-fotos');

CREATE POLICY "Auth update lugares fotos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lugares-fotos')
WITH CHECK (bucket_id = 'lugares-fotos');

CREATE POLICY "Public read lugares fotos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'lugares-fotos');

CREATE POLICY "Auth upload rotas fotos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'rotas-fotos');

CREATE POLICY "Auth update rotas fotos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'rotas-fotos')
WITH CHECK (bucket_id = 'rotas-fotos');

CREATE POLICY "Public read rotas fotos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'rotas-fotos');
