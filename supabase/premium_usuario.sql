-- Colunas de assinatura e uso de IA no perfil do usuário
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS premium_ativo boolean DEFAULT false;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS premium_ate timestamptz;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS uso_ia_mes text;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS buscas_ia integer DEFAULT 0;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS roteiros_ia integer DEFAULT 0;

-- Usuário pode ler e atualizar o próprio uso (contadores são validados nas APIs)
-- Ajuste policies conforme seu setup de RLS em perfis
