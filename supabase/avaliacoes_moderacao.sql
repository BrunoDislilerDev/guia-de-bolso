-- Migração opcional: status e colunas do sistema de avaliações melhorado.
-- Execute no SQL Editor do Supabase se ainda não aplicou manualmente.

-- Colunas extras (ignorar erro se já existirem)
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS aspectos jsonb DEFAULT '[]'::jsonb;
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS sugestao_ia text;
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS sentimento text;
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS motivo_rejeicao text;
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS resposta_estabelecimento text;
ALTER TABLE avaliacoes ADD COLUMN IF NOT EXISTS moderado_em timestamptz;

-- Normalizar status legados
UPDATE avaliacoes SET status = 'aprovado' WHERE status = 'aprovada';
UPDATE avaliacoes SET status = 'rejeitado' WHERE status = 'rejeitada';

-- Política: usuário insere própria avaliação pendente
DROP POLICY IF EXISTS avaliacoes_insert_own ON avaliacoes;
CREATE POLICY avaliacoes_insert_own ON avaliacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pendente');

-- Leitura pública de avaliações aprovadas
DROP POLICY IF EXISTS avaliacoes_select_aprovadas ON avaliacoes;
CREATE POLICY avaliacoes_select_aprovadas ON avaliacoes
  FOR SELECT
  USING (status IN ('aprovado', 'aprovada'));

-- Usuário vê a própria avaliação em qualquer status
DROP POLICY IF EXISTS avaliacoes_select_own ON avaliacoes;
CREATE POLICY avaliacoes_select_own ON avaliacoes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Pré-análise IA: usuário atualiza campos da própria avaliação pendente
DROP POLICY IF EXISTS avaliacoes_update_ia_own ON avaliacoes;
CREATE POLICY avaliacoes_update_ia_own ON avaliacoes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status IN ('pendente', 'aguardando_edicao'))
  WITH CHECK (auth.uid() = user_id);
