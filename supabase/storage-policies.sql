-- Policies para upload de avatar no bucket publico "imagens".
-- Rode este arquivo no Supabase SQL Editor.

CREATE POLICY "Usuarios podem fazer upload de avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'imagens'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Necessaria porque o app usa upload(..., { upsert: true }) no mesmo caminho
-- avatars/[user_id]/avatar.jpg quando a foto ja existe.
CREATE POLICY "Usuarios podem atualizar avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'imagens'
  AND auth.uid()::text = (storage.foldername(name))[2]
)
WITH CHECK (
  bucket_id = 'imagens'
  AND auth.uid()::text = (storage.foldername(name))[2]
);
