-- Expansão de tags por subcategoria (rodar após tags_subcategorias.sql)
-- Natureza: Lagoas, Dunas, Mirantes, Piscinas naturais
-- Gastronomia, Noite, Cultura, Aventura, Bem-estar, Compras — conforme catálogo canônico

-- ═══════════════════════════════════════════════════════════════
-- NATUREZA → Lagoas
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Lagoas"}
]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Águas calmas', 'Pedal de lago', 'Pesca no lago', 'Piquenique à beira do lago',
  'Lagoa cristalina', 'Banho de lago', 'Acesso de barco', 'Trilha até a lagoa',
  'Margem arborizada', 'Ideal para família', 'Observação de aves', 'Orla de lagoa',
  'Pôr do sol no lago', 'Pouco movimentado'
);

-- ═══════════════════════════════════════════════════════════════
-- NATUREZA → Dunas
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Dunas"}
]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Sandboard', 'Pôr do sol nas dunas', 'Trilha nas dunas', 'Dunas altas',
  'Vento forte', 'Fotos nas dunas', 'Acesso de carro', 'Dunas preservadas',
  'Paisagem única', 'Trilha curta', 'Sem sombra', 'Ideal para fotos'
);

-- ═══════════════════════════════════════════════════════════════
-- NATUREZA → Mirantes
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Mirantes"}
]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Vista 360°', 'Acesso fácil ao mirante', 'Trilha curta até o mirante',
  'Guarda-corpo', 'Mirante gratuito', 'Vista para o mar', 'Vista da serra',
  'Vista panorâmica', 'Instagramável', 'Ótimo para fotos', 'Nascer do sol',
  'Pôr do sol imperdível', 'Cenário único', 'Romântico'
);

-- ═══════════════════════════════════════════════════════════════
-- NATUREZA → Piscinas naturais
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Piscinas naturais"}
]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Piscina natural', 'Água cristalina', 'Poço fundo', 'Formação rochosa',
  'Mergulho livre', 'Acesso por trilha', 'Água gelada', 'Água morna',
  'Sem infraestrutura', 'Ideal para fotos', 'Piquenique', 'Escondido',
  'Poço para mergulho', 'Cachoeira para nadar'
);

-- Atributos gerais em Lagoas, Dunas, Mirantes e Piscinas naturais
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Lagoas"},
  {"categoria":"Natureza","nome":"Dunas"},
  {"categoria":"Natureza","nome":"Mirantes"},
  {"categoria":"Natureza","nome":"Piscinas naturais"}
]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Acessível', 'Estacionamento', 'Grátis', 'Banheiros disponíveis',
  'Cachorros permitidos', 'Familiar', 'Reserva necessária',
  'Melhor de manhã', 'Melhor à tarde', 'Evitar em alta temporada',
  'Ideal para crianças', 'Pouco movimentado'
);

-- ═══════════════════════════════════════════════════════════════
-- GASTRONOMIA (por subcategoria)
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'::jsonb,
categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Menu executivo', 'Frutos do mar', 'Comida local', 'Vegano/Vegetariano',
  'Comida de rua', 'Self-service', 'Rodízio', 'Reserva necessária',
  'Música ao vivo', 'Delivery', 'Familiar', 'Ideal para crianças',
  'Ambiente intimista', 'Romântico', 'Pet friendly', 'Aceita cartão',
  'Wi-Fi', 'Estacionamento', 'Acessível', 'Instagramável', 'Ótimo para fotos',
  'Pouco movimentado', 'Melhor de manhã', 'Melhor à tarde', 'Melhor à noite',
  'Grátis', 'Agitado', 'Cozinha regional', 'Porção generosa', 'Chef premiado',
  'Vista para o mar', 'Ambiente familiar', 'Opções sem glúten'
);

UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Bares"}]'::jsonb,
categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Agitado',
  'Ambiente intimista', 'Melhor à noite', 'Romântico', 'Petiscos variados',
  'Chopp gelado', 'Carta de cervejas', 'Drinks sem álcool', 'Tira-gosto',
  'Transmissão de jogos', 'Aceita cartão', 'Wi-Fi', 'Estacionamento'
);

UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Cafés"}]'::jsonb,
categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Café especial', 'Brunch', 'Menu executivo', 'Café da manhã incluso',
  'Wi-Fi', 'Vegano/Vegetariano', 'Pet friendly', 'Ambiente intimista',
  'Ideal para trabalhar', 'Sobremesas caseiras', 'Café orgânico',
  'Espaço ao ar livre', 'Acessível', 'Estacionamento', 'Instagramável'
);

UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Padarias"}]'::jsonb,
categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Pão fresco', 'Pão artesanal', 'Café da padaria', 'Salgados frescos',
  'Doces caseiros', 'Abre cedo', 'Encomendas', 'Sem glúten',
  'Familiar', 'Comida local', 'Aceita cartão', 'Estacionamento'
);

UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Sorveterias"}]'::jsonb,
categorias = '["Gastronomia"]'::jsonb
WHERE nome IN (
  'Sorvete artesanal', 'Sabores regionais', 'Açaí', 'Picolés naturais',
  'Opções veganas', 'Ideal para crianças', 'Familiar', 'Aceita cartão',
  'Espaço ao ar livre', 'Delivery', 'Comida local'
);

-- ═══════════════════════════════════════════════════════════════
-- NOITE
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Noite","nome":"Bares"}]'::jsonb,
categorias = '["Noite"]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Agitado',
  'Ambiente intimista', 'Melhor à noite', 'Romântico', 'Chopp gelado',
  'Carta de cervejas', 'Petiscos variados', 'Transmissão de jogos',
  'Aceita cartão', 'Wi-Fi', 'Estacionamento', 'Fila nos fins de semana'
);

UPDATE tags SET subcategorias = '[{"categoria":"Noite","nome":"Pubs"}]'::jsonb,
categorias = '["Noite"]'::jsonb
WHERE nome IN (
  'Cerveja artesanal', 'Ambiente descontraído', 'Música ao vivo',
  'Happy hour', 'Petiscos variados', 'Transmissão de jogos',
  'Melhor à noite', 'Romântico', 'Aceita cartão'
);

UPDATE tags SET subcategorias = '[{"categoria":"Noite","nome":"Baladas"}]'::jsonb,
categorias = '["Noite"]'::jsonb
WHERE nome IN (
  'Música eletrônica', 'Agitado', 'Melhor à noite', 'Open bar',
  'Lista VIP', 'Segurança reforçada', 'After party', 'Dress code',
  'Estacionamento', 'Aceita cartão', 'Fila nos fins de semana'
);

-- ═══════════════════════════════════════════════════════════════
-- CULTURA
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Museus"}]'::jsonb,
categorias = '["Cultura"]'::jsonb
WHERE nome IN (
  'Acervo local', 'Exposição temporária', 'Visita guiada', 'Arte local',
  'Histórico', 'Grátis', 'Reserva necessária', 'Acessível',
  'Instagramável', 'Ótimo para fotos', 'Melhor de manhã', 'Ideal para crianças',
  'Ar condicionado', 'Estacionamento', 'Audioguia'
);

UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Monumentos"}]'::jsonb,
categorias = '["Cultura"]'::jsonb
WHERE nome IN (
  'Patrimônio histórico', 'Histórico', 'Cenário único', 'Instagramável',
  'Ótimo para fotos', 'Grátis', 'Acessível', 'Pôr do sol imperdível',
  'Visita rápida', 'Placa histórica', 'Estacionamento próximo'
);

UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'::jsonb,
categorias = '["Cultura"]'::jsonb
WHERE nome IN (
  'Arquitetura histórica', 'Visita silenciosa', 'Missa aos domingos',
  'Grátis', 'Acessível', 'Instagramável', 'Patrimônio histórico',
  'Cenário único', 'Respeitar vestimenta', 'Estacionamento próximo'
);

-- ═══════════════════════════════════════════════════════════════
-- AVENTURA → Esportes radicais
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Aventura","nome":"Esportes radicais"}]'::jsonb,
categorias = '["Aventura"]'::jsonb
WHERE nome IN (
  'Para experientes', 'Ideal para iniciantes', 'Com guia', 'Sem guia necessário',
  'Reserva necessária', 'Rapel', 'Equipamento incluso', 'Seguro obrigatório',
  'Parapente', 'Asa delta', 'Rafting',
  'Trilha de bike', 'Aventura radical', 'Idade mínima', 'Treinamento incluso'
);

-- ═══════════════════════════════════════════════════════════════
-- BEM-ESTAR
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Bem-estar","nome":"Spa"}]'::jsonb,
categorias = '["Bem-estar"]'::jsonb
WHERE nome IN (
  'Massagem', 'Day spa', 'Ofurô', 'Sauna', 'Romântico', 'Reserva necessária',
  'Pacotes promocionais', 'Estacionamento', 'Acessível', 'Pouco movimentado',
  'Ambiente intimista', 'Aceita cartão'
);

UPDATE tags SET subcategorias = '[{"categoria":"Bem-estar","nome":"Yoga"}]'::jsonb,
categorias = '["Bem-estar"]'::jsonb
WHERE nome IN (
  'Aula ao ar livre', 'Aula para iniciantes', 'Meditação guiada', 'Ideal para iniciantes',
  'Reserva necessária', 'Ideal para iniciantes', 'Acessível',
  'Turmas reduzidas', 'Vista para o mar', 'Equipamento incluso'
);

UPDATE tags SET subcategorias = '[{"categoria":"Bem-estar","nome":"Terapias"}]'::jsonb,
categorias = '["Bem-estar"]'::jsonb
WHERE nome IN (
  'Massagem terapêutica', 'Reflexologia', 'Reiki', 'Acupuntura',
  'Reserva necessária', 'Atendimento domiciliar', 'Acessível',
  'Ambiente intimista', 'Estacionamento', 'Aceita cartão'
);

-- ═══════════════════════════════════════════════════════════════
-- COMPRAS → Lojas
-- ═══════════════════════════════════════════════════════════════
UPDATE tags SET subcategorias = '[{"categoria":"Compras","nome":"Lojas"}]'::jsonb,
categorias = '["Compras"]'::jsonb
WHERE nome IN (
  'Produtos locais', 'Arte local', 'Moda praia', 'Souvenirs',
  'Aceita cartão', 'Estacionamento', 'Acessível', 'Wi-Fi',
  'Grátis para visitar', 'Entrega local', 'Troca facilitada',
  'Horário estendido', 'Outlet', 'Loja de fábrica', 'Presentes criativos'
);

-- ═══════════════════════════════════════════════════════════════
-- Novas tags (INSERT)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  -- Natureza → Lagoas
  ('Águas calmas', '🏞️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Pedal de lago', '🚴', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Pesca no lago', '🎣', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Piquenique à beira do lago', '🧺', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Lagoa cristalina', '💎', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Banho de lago', '🏊', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Acesso de barco', '⛵', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Trilha até a lagoa', '🥾', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Margem arborizada', '🌳', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Orla de lagoa', '🏞️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  ('Pôr do sol no lago', '🌅', '["Natureza"]', '[{"categoria":"Natureza","nome":"Lagoas"}]'),
  -- Natureza → Dunas
  ('Sandboard', '🏂', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Pôr do sol nas dunas', '🌅', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Trilha nas dunas', '🥾', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Dunas altas', '🏜️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Vento forte', '💨', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Fotos nas dunas', '📸', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Dunas preservadas', '🌿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  ('Paisagem única', '✨', '["Natureza"]', '[{"categoria":"Natureza","nome":"Dunas"}]'),
  -- Natureza → Mirantes
  ('Vista 360°', '🔭', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  ('Acesso fácil ao mirante', '🚶', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  ('Trilha curta até o mirante', '🥾', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  ('Guarda-corpo', '🛡️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  ('Mirante gratuito', '🆓', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  ('Vista da serra', '⛰️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Mirantes"}]'),
  -- Natureza → Piscinas naturais
  ('Água cristalina', '💎', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Poço fundo', '🕳️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Formação rochosa', '🪨', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Mergulho livre', '🤿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Acesso por trilha', '🥾', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Água gelada', '🧊', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  ('Mata ao redor', '🌳', '["Natureza"]', '[{"categoria":"Natureza","nome":"Piscinas naturais"}]'),
  -- Gastronomia
  ('Cozinha regional', '🍲', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Porção generosa', '🍽️', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Chef premiado', '👨‍🍳', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Opções sem glúten', '🌾', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Ambiente familiar', '👨‍👩‍👧', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Petiscos variados', '🍢', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]'),
  ('Chopp gelado', '🍺', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]'),
  ('Carta de cervejas', '🍻', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]'),
  ('Tira-gosto', '🥟', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]'),
  ('Transmissão de jogos', '📺', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]'),
  ('Ideal para trabalhar', '💻', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Cafés"}]'),
  ('Sobremesas caseiras', '🍰', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Cafés"}]'),
  ('Café orgânico', '☕', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Cafés"}]'),
  ('Pão artesanal', '🥖', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Padarias"}]'),
  ('Salgados frescos', '🥐', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Padarias"}]'),
  ('Doces caseiros', '🧁', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Padarias"}]'),
  ('Abre cedo', '🌅', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Padarias"}]'),
  ('Sabores regionais', '🍦', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Sorveterias"}]'),
  ('Açaí', '🫐', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Sorveterias"}]'),
  ('Picolés naturais', '🍡', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Sorveterias"}]'),
  -- Noite
  ('Cerveja artesanal', '🍺', '["Noite"]', '[{"categoria":"Noite","nome":"Pubs"}]'),
  ('Ambiente descontraído', '😊', '["Noite"]', '[{"categoria":"Noite","nome":"Pubs"}]'),
  ('Open bar', '🍸', '["Noite"]', '[{"categoria":"Noite","nome":"Baladas"}]'),
  ('Lista VIP', '⭐', '["Noite"]', '[{"categoria":"Noite","nome":"Baladas"}]'),
  ('Dress code', '👔', '["Noite"]', '[{"categoria":"Noite","nome":"Baladas"}]'),
  ('Fila nos fins de semana', '⏳', '["Noite"]', '[{"categoria":"Noite","nome":"Baladas"},{"categoria":"Noite","nome":"Bares"}]'),
  ('Segurança reforçada', '🛡️', '["Noite"]', '[{"categoria":"Noite","nome":"Baladas"}]'),
  -- Cultura
  ('Acervo local', '🏛️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Museus"}]'),
  ('Exposição temporária', '🖼️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Museus"}]'),
  ('Visita guiada', '🎧', '["Cultura"]', '[{"categoria":"Cultura","nome":"Museus"}]'),
  ('Audioguia', '🔊', '["Cultura"]', '[{"categoria":"Cultura","nome":"Museus"}]'),
  ('Ar condicionado', '❄️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Museus"}]'),
  ('Placa histórica', '📜', '["Cultura"]', '[{"categoria":"Cultura","nome":"Monumentos"}]'),
  ('Visita rápida', '⏱️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Monumentos"}]'),
  ('Estacionamento próximo', '🅿️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Monumentos"},{"categoria":"Cultura","nome":"Igrejas e templos"}]'),
  ('Arquitetura histórica', '⛪', '["Cultura"]', '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'),
  ('Visita silenciosa', '🤫', '["Cultura"]', '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'),
  ('Missa aos domingos', '✝️', '["Cultura"]', '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'),
  ('Respeitar vestimenta', '👔', '["Cultura"]', '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'),
  -- Aventura
  ('Equipamento incluso', '🎒', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Seguro obrigatório', '📋', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Parapente', '🪂', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Asa delta', '🦅', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Rafting', '🚣', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Aventura radical', '⚡', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Idade mínima', '🔞', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  ('Treinamento incluso', '📚', '["Aventura"]', '[{"categoria":"Aventura","nome":"Esportes radicais"}]'),
  -- Bem-estar
  ('Day spa', '💆', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Spa"}]'),
  ('Ofurô', '🛁', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Spa"}]'),
  ('Sauna', '🧖', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Spa"}]'),
  ('Pacotes promocionais', '🎁', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Spa"}]'),
  ('Aula ao ar livre', '🧘', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Yoga"}]'),
  ('Aula para iniciantes', '🧘', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Yoga"}]'),
  ('Meditação guiada', '🧘‍♀️', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Yoga"}]'),
  ('Turmas reduzidas', '👥', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Yoga"}]'),
  ('Massagem terapêutica', '💆‍♀️', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Terapias"}]'),
  ('Reflexologia', '🦶', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Terapias"}]'),
  ('Reiki', '✨', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Terapias"}]'),
  ('Acupuntura', '📍', '["Bem-estar"]', '[{"categoria":"Bem-estar","nome":"Terapias"}]'),
  -- Compras
  ('Moda praia', '👙', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Souvenirs', '🎁', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Horário estendido', '🕘', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Outlet', '🏷️', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Loja de fábrica', '🏭', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Presentes criativos', '🎀', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Troca facilitada', '🔄', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]'),
  ('Entrega local', '📦', '["Compras"]', '[{"categoria":"Compras","nome":"Lojas"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

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
