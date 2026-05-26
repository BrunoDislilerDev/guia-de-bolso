-- Garante ≥10 tags por subcategoria canônica (rodar após tags_subcategorias_expansao.sql)
-- Subcategorias que estavam abaixo do mínimo: Serviços (5), Aventura (Passeios/Escalada/Ciclismo), Compras (Feiras, Artesanato)

-- ═══════════════════════════════════════════════════════════════
-- Novas tags (INSERT) — vocabulário exclusivo por subcategoria
-- ═══════════════════════════════════════════════════════════════

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  -- Serviços → Farmácias
  ('Medicamento genérico', '💊', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Manipulação', '⚗️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Vacinas', '💉', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Delivery de remédios', '🛵', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Atendimento farmacêutico', '👨‍⚕️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Convênio farmácia', '🏥', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Produtos de higiene', '🧴', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  ('Orientação gratuita', 'ℹ️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Farmácias"}]'),
  -- Serviços → Mercados
  ('Hortifruti', '🥬', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Açougue no mercado', '🥩', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Padaria no mercado', '🥖', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Produtos orgânicos', '🌱', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Abastece de carro', '🚗', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Feira no mercado', '🧺', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Produtos da região', '🗺️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  ('Preço popular', '💰', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mercados"}]'),
  -- Serviços → Mecânicos
  ('Troca de óleo', '🛢️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Oficina autorizada', '✅', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Guincho 24h', '🚛', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Alinhamento e balanceamento', '⚙️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Ar-condicionado automotivo', '❄️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Borracharia', '🛞', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Diagnóstico computadorizado', '💻', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  ('Orçamento sem compromisso', '📋', '["Serviços"]', '[{"categoria":"Serviços","nome":"Mecânicos"}]'),
  -- Serviços → Salões
  ('Corte masculino', '✂️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Coloração', '🎨', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Manicure', '💅', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Barbearia', '🧔', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Escova progressiva', '💇', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Atendimento com hora marcada', '📅', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Produtos profissionais', '🧴', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  ('Ambiente climatizado', '❄️', '["Serviços"]', '[{"categoria":"Serviços","nome":"Salões"}]'),
  -- Serviços → Saúde
  ('Clínico geral', '🩺', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Odontologia', '🦷', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Pediatria', '👶', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Exames laboratoriais', '🔬', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Urgência', '🚨', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Convênio aceito', '🏥', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Teleconsulta', '💻', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  ('Consulta domiciliar', '🏠', '["Serviços"]', '[{"categoria":"Serviços","nome":"Saúde"}]'),
  -- Aventura → Passeios de barco
  ('Passeio de escuna', '⛵', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Avistamento de golfinhos', '🐬', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Mergulho com cilindro', '🤿', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Snorkel', '🐠', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Pesca em alto mar', '🎣', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Pôr do sol no mar', '🌅', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Roteiro para ilhas', '🏝️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Lancha privativa', '🚤', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Embarque na marina', '⚓', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  ('Roteiro com almoço', '🍽️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Passeios de barco"}]'),
  -- Aventura → Escalada
  ('Via ferrata', '🧗', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Boulder', '🪨', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Escalada indoor', '🏢', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Parede natural', '⛰️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Instrutor certificado', '📜', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Altura moderada', '📏', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Chapéu e protetor solar', '🧢', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Grau de dificuldade variado', '📊', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Escalada esportiva', '🧗‍♂️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  ('Fissura e diedro', '🪨', '["Aventura"]', '[{"categoria":"Aventura","nome":"Escalada"}]'),
  -- Aventura → Ciclismo
  ('Aluguel de bike', '🚲', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Rota sinalizada', '🪧', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Trilha de MTB', '🚵', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('E-bike disponível', '⚡', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Ciclovia', '🛤️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Rota costeira', '🌊', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Grupo guiado', '👥', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Kit de reparo', '🔧', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Capacete incluso', '⛑️', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  ('Pedal ao amanhecer', '🌄', '["Aventura"]', '[{"categoria":"Aventura","nome":"Ciclismo"}]'),
  -- Compras → Feiras
  ('Feira livre', '🧺', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Produtos da roça', '🌾', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Artesanato na feira', '🎨', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Barracas variadas', '🏪', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Melhor aos domingos', '📅', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Comida de feira', '🌽', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Produtos sazonais', '🍓', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  ('Negociação', '🤝', '["Compras"]', '[{"categoria":"Compras","nome":"Feiras"}]'),
  -- Compras → Artesanato
  ('Cerâmica', '🏺', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Renda e bordado', '🧵', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Madeira trabalhada', '🪵', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Peças únicas', '✨', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Oficina aberta ao público', '🏭', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Encomendas', '📦', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Souvenir artesanal', '🎁', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  ('Feito à mão', '✋', '["Compras"]', '[{"categoria":"Compras","nome":"Artesanato"}]'),
  -- Compras → Lojas (reforço)
  ('Vitrine instagramável', '📸', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- ═══════════════════════════════════════════════════════════════
-- AVENTURA — acrescenta subcategoria sem remover vínculos existentes
-- ═══════════════════════════════════════════════════════════════

UPDATE tags t
SET subcategorias = t.subcategorias || v.nova::jsonb
FROM (VALUES
  ('Ótimo para mergulho', '{"categoria":"Aventura","nome":"Passeios de barco"}'),
  ('Com guia', '{"categoria":"Aventura","nome":"Passeios de barco"}'),
  ('Reserva necessária', '{"categoria":"Aventura","nome":"Passeios de barco"}'),
  ('Rapel', '{"categoria":"Aventura","nome":"Escalada"}'),
  ('Para experientes', '{"categoria":"Aventura","nome":"Escalada"}'),
  ('Ideal para iniciantes', '{"categoria":"Aventura","nome":"Escalada"}'),
  ('Trilha de bike', '{"categoria":"Aventura","nome":"Ciclismo"}')
) AS v(nome, nova)
WHERE t.nome = v.nome
  AND NOT t.subcategorias @> jsonb_build_array(v.nova::jsonb);

-- Re-sincroniza categorias
UPDATE tags t
SET categorias = COALESCE(
  (
    SELECT jsonb_agg(DISTINCT elem ORDER BY elem)
    FROM (
      SELECT jsonb_array_elements(t.subcategorias)->>'categoria' AS elem
    ) s
    WHERE elem IS NOT NULL AND elem <> ''
  ),
  t.categorias,
  '[]'::jsonb
)
WHERE jsonb_array_length(COALESCE(t.subcategorias, '[]'::jsonb)) > 0;
