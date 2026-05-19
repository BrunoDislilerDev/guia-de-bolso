-- Relacionamento logs → perfis (necessário para .select('*, perfis(nome)'))
ALTER TABLE logs
  DROP CONSTRAINT IF EXISTS logs_user_id_fkey;

ALTER TABLE logs
  ADD CONSTRAINT logs_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES perfis(id) ON DELETE SET NULL;

-- RLS: permitir leitura dos logs no painel admin
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin lê logs" ON logs;

CREATE POLICY "Admin lê logs"
ON logs
FOR SELECT
USING (true);
