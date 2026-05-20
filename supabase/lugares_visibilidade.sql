-- Visibilidade de endereço e horários na página do lugar (admin + app)
ALTER TABLE lugares
  ADD COLUMN IF NOT EXISTS mostrar_endereco boolean NOT NULL DEFAULT true;

ALTER TABLE lugares
  ADD COLUMN IF NOT EXISTS mostrar_horarios boolean NOT NULL DEFAULT true;
