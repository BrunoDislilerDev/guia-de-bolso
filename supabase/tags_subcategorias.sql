-- Tags por subcategoria: formulário de locais filtra por categoria + subcategoria.
-- Formato: [{"categoria":"Natureza","nome":"Praias"}, ...]
-- Rodar no SQL Editor do Supabase após tags_categorias.sql / taxonomia_lugares_cleanup.sql

ALTER TABLE tags ADD COLUMN IF NOT EXISTS subcategorias jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ─── Natureza → Praias ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"}
]'::jsonb
WHERE nome IN (
  'Surfe', 'Stand-up paddle', 'Bodyboard', 'Praia paradisíaca', 'Costão',
  'Mar calmo', 'Mar agitado', 'Ótimo para mergulho', 'Vista para o mar',
  'Pôr do sol imperdível', 'Salva-vidas', 'Sem sombra', 'Sombra natural',
  'Água morna', 'Água fria', 'Corais', 'Frente mar',
  'Areia clara', 'Ondas fortes', 'Quiosque na areia', 'Estacionamento na areia',
  'Praia deserta', 'Acesso por escada', 'Banho de mar', 'Risco de ressaca',
  'Praia com estrutura', 'Bandeira azul', 'Não recomendado para crianças'
);

-- Praias + Mirantes (vistas)
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Mirantes"}
]'::jsonb
WHERE nome IN (
  'Vista panorâmica', 'Instagramável', 'Ótimo para fotos', 'Nascer do sol',
  'Cenário único', 'Romântico'
);

-- ─── Natureza → Trilhas ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"}
]'::jsonb
WHERE nome IN (
  'Trilha curta', 'Trilha longa', 'Trilha acessível', 'Acesso apenas por trilha',
  'Com guia', 'Sem guia necessário', 'Camping permitido', 'Estrada de terra',
  'Só de carro', 'Escondido', 'Para experientes', 'Ideal para iniciantes',
  'Sem infraestrutura', 'Trilha leve', 'Observação de aves'
);

-- Trilhas + Aventura (Esportes radicais)
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Aventura","nome":"Esportes radicais"}
]'::jsonb
WHERE nome IN ('Trilha de bike', 'Rapel');

-- ─── Natureza → Cachoeiras ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Cachoeiras"}
]'::jsonb
WHERE nome IN (
  'Cachoeira para nadar', 'Piscina natural'
);

-- ─── Natureza → Mirantes ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Mirantes"}
]'::jsonb
WHERE nome IN ('Vista panorâmica', 'Instagramável', 'Ótimo para fotos', 'Nascer do sol', 'Cenário único')
  AND (subcategorias IS NULL OR subcategorias = '[]'::jsonb);

-- ─── Natureza → Lagoas, Parques, Piscinas naturais, Dunas, Ilhas ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Lagoas"},
  {"categoria":"Natureza","nome":"Parques"}
]'::jsonb
WHERE nome IN ('Piquenique', 'Área de churrasco');

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Piscinas naturais"}
]'::jsonb
WHERE nome IN ('Piscina natural')
  AND subcategorias = '[]'::jsonb;

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Parques"},
  {"categoria":"Natureza","nome":"Praias"}
]'::jsonb
WHERE nome IN ('Ideal para crianças', 'Familiar', 'Cachorros permitidos');

-- Natureza — várias subcategorias (atributos gerais ao ar livre)
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Natureza","nome":"Cachoeiras"},
  {"categoria":"Natureza","nome":"Mirantes"},
  {"categoria":"Natureza","nome":"Lagoas"},
  {"categoria":"Natureza","nome":"Parques"},
  {"categoria":"Natureza","nome":"Piscinas naturais"},
  {"categoria":"Natureza","nome":"Dunas"},
  {"categoria":"Natureza","nome":"Ilhas"}
]'::jsonb
WHERE nome IN (
  'Acessível', 'Estacionamento', 'Grátis', 'Banheiros disponíveis',
  'Evitar em alta temporada', 'Pouco movimentado', 'Reserva necessária',
  'Melhor de manhã', 'Melhor à tarde', 'Melhor à noite'
);

-- ─── Gastronomia ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"}
]'::jsonb
WHERE nome IN (
  'Menu executivo', 'Frutos do mar', 'Comida local', 'Vegano/Vegetariano',
  'Aceita cartão', 'Wi-Fi', 'Pet friendly', 'Romântico', 'Reserva necessária',
  'Música ao vivo', 'Delivery', 'Familiar', 'Ideal para crianças',
  'Estacionamento', 'Acessível', 'Instagramável', 'Ótimo para fotos',
  'Pouco movimentado', 'Melhor de manhã', 'Melhor à tarde', 'Melhor à noite',
  'Agitado', 'Ambiente intimista', 'Grátis'
) AND categorias::text LIKE '%Gastronomia%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Cafés"}
]'::jsonb
WHERE nome IN ('Wi-Fi', 'Vegano/Vegetariano', 'Pet friendly')
  AND subcategorias = '[]'::jsonb
  AND categorias::text LIKE '%Gastronomia%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Bares"}
]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Agitado',
  'Ambiente intimista', 'Melhor à noite', 'Romântico'
);

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Cafés"}
]'::jsonb
WHERE nome IN ('Café da manhã incluso')
  OR nome = 'Menu executivo';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Padarias"},
  {"categoria":"Gastronomia","nome":"Sorveterias"}
]'::jsonb
WHERE nome IN ('Comida local', 'Ideal para crianças', 'Familiar')
  AND categorias::text LIKE '%Gastronomia%'
  AND subcategorias = '[]'::jsonb;

-- ─── Noite ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"}
]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Agitado',
  'Ambiente intimista', 'Melhor à noite', 'Romântico', 'Música eletrônica'
) AND categorias::text LIKE '%Noite%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"}
]'::jsonb
WHERE nome IN ('Agitado', 'Melhor à noite');

UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Baladas"}
]'::jsonb
WHERE nome IN ('Música eletrônica');

-- ─── Serviços ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Mecânicos"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome IN (
  'Atendimento 24h', 'Delivery', 'Estacionamento', 'Acessível',
  'Aceita cartão', 'Wi-Fi'
) AND categorias::text LIKE '%Serviços%';

-- ─── Hospedagem ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"}
]'::jsonb
WHERE nome IN (
  'Orla', 'Café da manhã incluso', 'Pet friendly', 'Romântico',
  'Wi-Fi', 'Estacionamento', 'Acessível', 'Vista para o mar', 'Frente mar',
  'Pouco movimentado', 'Reserva necessária', 'Ideal para crianças', 'Familiar'
) AND categorias::text LIKE '%Hospedagem%';

-- ─── Cultura ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Cultura","nome":"Museus"},
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"},
  {"categoria":"Cultura","nome":"Eventos"}
]'::jsonb
WHERE nome IN (
  'Histórico', 'Patrimônio histórico', 'Arte local', 'Grátis',
  'Reserva necessária', 'Acessível', 'Instagramável', 'Ótimo para fotos',
  'Melhor de manhã', 'Melhor à tarde', 'Melhor à noite'
) AND categorias::text LIKE '%Cultura%';

-- ─── Aventura ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Aventura","nome":"Esportes radicais"}
]'::jsonb
WHERE nome IN (
  'Para experientes', 'Ideal para iniciantes', 'Com guia', 'Sem guia necessário',
  'Reserva necessária', 'Rapel'
) AND categorias::text LIKE '%Aventura%'
  AND subcategorias = '[]'::jsonb;

UPDATE tags SET subcategorias = '[
  {"categoria":"Aventura","nome":"Passeios de barco"}
]'::jsonb
WHERE nome IN ('Ótimo para mergulho', 'Com guia', 'Reserva necessária')
  AND categorias::text LIKE '%Aventura%'
  AND subcategorias = '[]'::jsonb;

UPDATE tags SET subcategorias = '[
  {"categoria":"Aventura","nome":"Escalada"},
  {"categoria":"Aventura","nome":"Ciclismo"}
]'::jsonb
WHERE nome IN ('Trilha de bike', 'Rapel', 'Para experientes')
  AND subcategorias = '[]'::jsonb
  AND categorias::text LIKE '%Aventura%';

-- ─── Bem-estar ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Bem-estar","nome":"Spa"},
  {"categoria":"Bem-estar","nome":"Yoga"},
  {"categoria":"Bem-estar","nome":"Terapias"}
]'::jsonb
WHERE nome IN (
  'Massagem', 'Pouco movimentado', 'Reserva necessária', 'Romântico',
  'Acessível', 'Estacionamento', 'Ideal para iniciantes'
) AND categorias::text LIKE '%Bem-estar%';

-- ─── Compras ───
UPDATE tags SET subcategorias = '[
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Feiras"},
  {"categoria":"Compras","nome":"Artesanato"}
]'::jsonb
WHERE nome IN (
  'Produtos locais', 'Arte local', 'Aceita cartão', 'Estacionamento',
  'Acessível', 'Wi-Fi', 'Grátis'
) AND categorias::text LIKE '%Compras%';

-- Sincroniza categorias a partir das subcategorias vinculadas
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

-- ─── Novas tags (vocabulário por subcategoria) ───

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  -- Natureza → Praias
  ('Areia clara', '🏖️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Ondas fortes', '🌊', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Quiosque na areia', '🏖️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Estacionamento na areia', '🅿️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Praia deserta', '🏝️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Acesso por escada', '🪜', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Banho de mar', '🏊', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Risco de ressaca', '⚠️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Praia com estrutura', '🏖️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Bandeira azul', '🔵', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Não recomendado para crianças', '⚠️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Tartarugas (temporada)', '🐢', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Pesca esportiva', '🎣', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  ('Passeio de barco na praia', '⛵', '["Natureza"]', '[{"categoria":"Natureza","nome":"Praias"}]'),
  -- Natureza → Trilhas
  ('Trilha com crianças', '👨‍👩‍👧', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  ('Trilha com mirante', '🔭', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  ('Trilha com cachoeira', '💧', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  ('Trilha na mata', '🌳', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  ('Trilha costeira', '🌊', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  ('Levar água e lanche', '🎒', '["Natureza"]', '[{"categoria":"Natureza","nome":"Trilhas"}]'),
  -- Natureza → Cachoeiras
  ('Poço para mergulho', '🤿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Cachoeiras"}]'),
  ('Cachoeira com queda alta', '💦', '["Natureza"]', '[{"categoria":"Natureza","nome":"Cachoeiras"}]'),
  ('Cachoeira isolada', '🌿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Cachoeiras"}]'),
  -- Gastronomia
  ('Comida de rua', '🌮', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Self-service', '🍽️', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Rodízio', '🥩', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Restaurantes"}]'),
  ('Café especial', '☕', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Cafés"}]'),
  ('Brunch', '🥐', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Cafés"}]'),
  ('Sorvete artesanal', '🍦', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Sorveterias"}]'),
  ('Pão fresco', '🥖', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Padarias"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);
