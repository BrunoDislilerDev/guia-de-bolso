-- ═══════════════════════════════════════════════════════════════════════════════
-- Vínculos definitivos tags ↔ subcategorias (idempotente)
-- Rodar UMA VEZ no Supabase após tags_subcategorias*.sql
--
-- Corrige UPDATEs que sobrescreviam subcategorias[] e removiam subcategorias
-- compartilhadas (ex.: Pubs com 6 tags, Cultura|Eventos, Gastronomia|Bares, Ilhas).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── NATUREZA ───────────────────────────────────────────────────────────────

-- Atributos gerais ao ar livre (todas as subcategorias de Natureza)
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
  'Melhor de manhã', 'Melhor à tarde', 'Melhor à noite',
  'Cachorros permitidos', 'Familiar', 'Ideal para crianças'
);

-- Praias + Mirantes (vistas)
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Mirantes"}
]'::jsonb
WHERE nome IN (
  'Vista panorâmica', 'Instagramável', 'Ótimo para fotos', 'Nascer do sol',
  'Cenário único', 'Romântico', 'Pôr do sol imperdível', 'Vista para o mar'
);

-- Trilhas + Dunas (trilha curta em dunas também)
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Natureza","nome":"Dunas"}
]'::jsonb
WHERE nome = 'Trilha curta';

-- Trilhas + Esportes radicais
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Aventura","nome":"Esportes radicais"}
]'::jsonb
WHERE nome IN ('Trilha de bike', 'Rapel');

-- Cachoeiras + Piscinas naturais
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Cachoeiras"},
  {"categoria":"Natureza","nome":"Piscinas naturais"}
]'::jsonb
WHERE nome IN (
  'Cachoeira para nadar', 'Piscina natural', 'Poço para mergulho',
  'Cachoeira com queda alta', 'Cachoeira isolada', 'Água cristalina',
  'Poço fundo', 'Mergulho livre', 'Água gelada', 'Água morna'
);

-- Parques + Praias + Lagoas
UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Parques"},
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Lagoas"}
]'::jsonb
WHERE nome IN (
  'Piquenique', 'Área de churrasco', 'Ideal para crianças', 'Familiar', 'Cachorros permitidos',
  'Observação de aves', 'Trilha leve'
);

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Playground infantil', '🛝', '["Natureza"]', '[{"categoria":"Natureza","nome":"Parques"}]'),
  ('Área verde ampla', '🌳', '["Natureza"]', '[{"categoria":"Natureza","nome":"Parques"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- Ilhas — vocabulário
UPDATE tags SET subcategorias = '[{"categoria":"Natureza","nome":"Ilhas"}]'::jsonb,
categorias = '["Natureza"]'::jsonb
WHERE nome IN (
  'Travessia de balsa', 'Barco para a ilha', 'Praia isolada', 'Mergulho na ilha',
  'Trilha na ilha', 'Camping na ilha', 'Observação de aves', 'Pouca infraestrutura',
  'Reserva ambiental', 'Acesso por barco'
);

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Travessia de balsa', '⛴️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Barco para a ilha', '🚤', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Praia isolada', '🏝️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Mergulho na ilha', '🤿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Trilha na ilha', '🥾', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Camping na ilha', '⛺', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Pouca infraestrutura', '🏕️', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Reserva ambiental', '🌿', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]'),
  ('Acesso por barco', '⚓', '["Natureza"]', '[{"categoria":"Natureza","nome":"Ilhas"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- ─── GASTRONOMIA + NOITE (mesma linha em tags quando categorias[] tem ambas) ─

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"}
]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Ambiente intimista', 'Romântico',
  'Chopp gelado', 'Carta de cervejas', 'Petiscos variados', 'Transmissão de jogos',
  'Agitado', 'Melhor à noite'
)
AND (categorias::text LIKE '%Gastronomia%' OR categorias::text LIKE '%Noite%');

UPDATE tags SET subcategorias = '[{"categoria":"Gastronomia","nome":"Bares"}]'::jsonb
WHERE nome IN ('Drinks sem álcool', 'Tira-gosto', 'Mesa ao ar livre')
  AND categorias::text LIKE '%Gastronomia%';

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Mesa ao ar livre', '🪑', '["Gastronomia"]', '[{"categoria":"Gastronomia","nome":"Bares"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Cafés"}
]'::jsonb
WHERE nome IN (
  'Wi-Fi', 'Vegano/Vegetariano', 'Pet friendly', 'Acessível', 'Estacionamento',
  'Aceita cartão', 'Ambiente intimista', 'Instagramável', 'Reserva necessária'
)
AND categorias::text LIKE '%Gastronomia%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Padarias"},
  {"categoria":"Gastronomia","nome":"Sorveterias"}
]'::jsonb
WHERE nome IN ('Comida local', 'Familiar', 'Ideal para crianças', 'Delivery')
  AND categorias::text LIKE '%Gastronomia%';

-- Noite (reforço — mesmo bloco do tags_noite_subcategorias_fix.sql)
UPDATE tags SET subcategorias = '[{"categoria":"Noite","nome":"Baladas"}]'::jsonb,
categorias = '["Noite"]'::jsonb
WHERE nome IN ('Open bar', 'Lista VIP', 'Segurança reforçada', 'After party', 'Dress code')
  AND categorias::text LIKE '%Noite%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"}
]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Ambiente intimista', 'Romântico',
  'Chopp gelado', 'Carta de cervejas', 'Petiscos variados', 'Transmissão de jogos',
  'Aceita cartão', 'Wi-Fi', 'Estacionamento'
)
AND categorias::text LIKE '%Noite%'
AND categorias::text NOT LIKE '%Gastronomia%';

UPDATE tags SET subcategorias = '[{"categoria":"Noite","nome":"Pubs"}]'::jsonb
WHERE nome IN ('Cerveja artesanal', 'Ambiente descontraído')
  AND categorias::text LIKE '%Noite%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"}
]'::jsonb
WHERE nome IN ('Agitado', 'Melhor à noite')
  AND categorias::text LIKE '%Noite%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Baladas"}
]'::jsonb
WHERE nome IN ('Música eletrônica', 'Fila nos fins de semana')
  AND categorias::text LIKE '%Noite%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Gastronomia","nome":"Restaurantes"}
]'::jsonb
WHERE nome = 'Delivery';

-- ─── CULTURA ────────────────────────────────────────────────────────────────

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
)
AND categorias::text LIKE '%Cultura%';

UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Museus"}]'::jsonb
WHERE nome IN (
  'Acervo local', 'Exposição temporária', 'Visita guiada', 'Audioguia',
  'Ar condicionado', 'Ideal para crianças', 'Melhor de manhã'
)
AND categorias::text LIKE '%Cultura%';

UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Monumentos"}]'::jsonb
WHERE nome IN (
  'Placa histórica', 'Visita rápida', 'Pôr do sol imperdível',
  'Cenário único'
)
AND categorias::text LIKE '%Cultura%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"}
]'::jsonb
WHERE nome = 'Estacionamento próximo'
  AND categorias::text LIKE '%Cultura%';

UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Igrejas e templos"}]'::jsonb
WHERE nome IN (
  'Arquitetura histórica', 'Visita silenciosa', 'Missa aos domingos', 'Respeitar vestimenta'
)
AND categorias::text LIKE '%Cultura%';

-- Eventos — vocabulário
UPDATE tags SET subcategorias = '[{"categoria":"Cultura","nome":"Eventos"}]'::jsonb
WHERE nome IN (
  'Shows ao vivo', 'Festival local', 'Evento gratuito', 'Ingresso antecipado',
  'Programação infantil', 'Evento ao ar livre', 'Feira cultural', 'Palestras e oficinas'
);

INSERT INTO tags (nome, icone, categorias, subcategorias)
SELECT v.nome, v.icone, v.categorias::jsonb, v.subcategorias::jsonb
FROM (VALUES
  ('Shows ao vivo', '🎤', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Festival local', '🎪', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Evento gratuito', '🆓', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Ingresso antecipado', '🎫', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Programação infantil', '👶', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Evento ao ar livre', '🌳', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Feira cultural', '🎭', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]'),
  ('Palestras e oficinas', '📚', '["Cultura"]', '[{"categoria":"Cultura","nome":"Eventos"}]')
) AS v(nome, icone, categorias, subcategorias)
WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.nome = v.nome);

-- ─── HOSPEDAGEM (3 subcategorias compartilham atributos) ────────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"}
]'::jsonb
WHERE nome IN (
  'Café da manhã incluso', 'Pet friendly', 'Wi-Fi', 'Estacionamento', 'Acessível',
  'Vista para o mar', 'Frente mar', 'Pouco movimentado', 'Reserva necessária',
  'Ideal para crianças', 'Familiar', 'Orla'
)
AND categorias::text LIKE '%Hospedagem%';

-- ─── BEM-ESTAR (atributos comuns às 3 subcategorias) ────────────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Bem-estar","nome":"Spa"},
  {"categoria":"Bem-estar","nome":"Yoga"},
  {"categoria":"Bem-estar","nome":"Terapias"}
]'::jsonb
WHERE nome IN (
  'Reserva necessária', 'Acessível', 'Estacionamento', 'Pouco movimentado',
  'Ideal para iniciantes', 'Ambiente intimista', 'Aceita cartão'
)
AND categorias::text LIKE '%Bem-estar%'
AND nome NOT IN ('Romântico', 'Massagem');

-- ─── COMPRAS ────────────────────────────────────────────────────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Feiras"},
  {"categoria":"Compras","nome":"Artesanato"}
]'::jsonb
WHERE nome IN (
  'Produtos locais', 'Arte local', 'Aceita cartão', 'Estacionamento',
  'Acessível', 'Wi-Fi', 'Grátis'
)
AND categorias::text LIKE '%Compras%';

-- ─── SERVIÇOS (genéricas em múltiplas subcategorias) ───────────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Mecânicos"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome = 'Atendimento 24h';

UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Mecânicos"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome IN ('Estacionamento', 'Acessível', 'Aceita cartão')
  AND categorias::text LIKE '%Serviços%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome = 'Wi-Fi'
  AND categorias::text LIKE '%Serviços%';

UPDATE tags SET subcategorias = '[
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome = 'Reserva necessária'
  AND categorias::text LIKE '%Serviços%';

-- ─── AVENTURA (vínculos cruzados) ───────────────────────────────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Aventura","nome":"Esportes radicais"},
  {"categoria":"Aventura","nome":"Escalada"}
]'::jsonb
WHERE nome = 'Rapel';

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Aventura","nome":"Esportes radicais"},
  {"categoria":"Aventura","nome":"Ciclismo"}
]'::jsonb
WHERE nome = 'Trilha de bike';

UPDATE tags SET subcategorias = '[
  {"categoria":"Aventura","nome":"Esportes radicais"},
  {"categoria":"Aventura","nome":"Passeios de barco"},
  {"categoria":"Natureza","nome":"Praias"}
]'::jsonb
WHERE nome = 'Ótimo para mergulho';

UPDATE tags SET subcategorias = '[
  {"categoria":"Aventura","nome":"Esportes radicais"},
  {"categoria":"Aventura","nome":"Escalada"},
  {"categoria":"Aventura","nome":"Ciclismo"},
  {"categoria":"Aventura","nome":"Passeios de barco"},
  {"categoria":"Natureza","nome":"Trilhas"}
]'::jsonb
WHERE nome IN ('Para experientes', 'Ideal para iniciantes', 'Com guia', 'Sem guia necessário')
  AND categorias::text LIKE '%Aventura%';

-- ─── Tags usadas em várias categorias (uma linha no banco) ─────────────────

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Mirantes"},
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"},
  {"categoria":"Bem-estar","nome":"Spa"},
  {"categoria":"Cultura","nome":"Museus"},
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"},
  {"categoria":"Cultura","nome":"Eventos"}
]'::jsonb
WHERE nome = 'Romântico';

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Natureza","nome":"Cachoeiras"},
  {"categoria":"Natureza","nome":"Mirantes"},
  {"categoria":"Natureza","nome":"Lagoas"},
  {"categoria":"Natureza","nome":"Parques"},
  {"categoria":"Natureza","nome":"Piscinas naturais"},
  {"categoria":"Natureza","nome":"Dunas"},
  {"categoria":"Natureza","nome":"Ilhas"},
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Cafés"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Gastronomia","nome":"Padarias"},
  {"categoria":"Gastronomia","nome":"Sorveterias"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"},
  {"categoria":"Cultura","nome":"Museus"},
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"},
  {"categoria":"Cultura","nome":"Eventos"},
  {"categoria":"Aventura","nome":"Esportes radicais"},
  {"categoria":"Aventura","nome":"Passeios de barco"},
  {"categoria":"Aventura","nome":"Escalada"},
  {"categoria":"Aventura","nome":"Ciclismo"},
  {"categoria":"Bem-estar","nome":"Spa"},
  {"categoria":"Bem-estar","nome":"Yoga"},
  {"categoria":"Bem-estar","nome":"Terapias"},
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"},
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Feiras"},
  {"categoria":"Compras","nome":"Artesanato"}
]'::jsonb
WHERE nome = 'Reserva necessária';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Gastronomia","nome":"Cafés"},
  {"categoria":"Gastronomia","nome":"Padarias"},
  {"categoria":"Gastronomia","nome":"Sorveterias"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"},
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Feiras"},
  {"categoria":"Compras","nome":"Artesanato"},
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Mecânicos"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome = 'Aceita cartão';

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Cafés"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"},
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"}
]'::jsonb
WHERE nome = 'Wi-Fi';

UPDATE tags SET subcategorias = '[
  {"categoria":"Natureza","nome":"Praias"},
  {"categoria":"Natureza","nome":"Trilhas"},
  {"categoria":"Natureza","nome":"Cachoeiras"},
  {"categoria":"Natureza","nome":"Mirantes"},
  {"categoria":"Natureza","nome":"Lagoas"},
  {"categoria":"Natureza","nome":"Parques"},
  {"categoria":"Natureza","nome":"Piscinas naturais"},
  {"categoria":"Natureza","nome":"Dunas"},
  {"categoria":"Natureza","nome":"Ilhas"},
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Gastronomia","nome":"Cafés"},
  {"categoria":"Gastronomia","nome":"Padarias"},
  {"categoria":"Gastronomia","nome":"Sorveterias"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"},
  {"categoria":"Cultura","nome":"Museus"},
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"},
  {"categoria":"Cultura","nome":"Eventos"},
  {"categoria":"Hospedagem","nome":"Pousadas"},
  {"categoria":"Hospedagem","nome":"Hostels"},
  {"categoria":"Hospedagem","nome":"Hotéis"},
  {"categoria":"Bem-estar","nome":"Spa"},
  {"categoria":"Bem-estar","nome":"Yoga"},
  {"categoria":"Bem-estar","nome":"Terapias"},
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Feiras"},
  {"categoria":"Compras","nome":"Artesanato"},
  {"categoria":"Serviços","nome":"Farmácias"},
  {"categoria":"Serviços","nome":"Mercados"},
  {"categoria":"Serviços","nome":"Mecânicos"},
  {"categoria":"Serviços","nome":"Salões"},
  {"categoria":"Serviços","nome":"Saúde"}
]'::jsonb
WHERE nome IN ('Estacionamento', 'Acessível');

UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"},
  {"categoria":"Noite","nome":"Baladas"}
]'::jsonb
WHERE nome = 'Agitado';

UPDATE tags SET subcategorias = '[
  {"categoria":"Cultura","nome":"Museus"},
  {"categoria":"Cultura","nome":"Monumentos"},
  {"categoria":"Cultura","nome":"Igrejas e templos"},
  {"categoria":"Cultura","nome":"Eventos"},
  {"categoria":"Gastronomia","nome":"Restaurantes"},
  {"categoria":"Gastronomia","nome":"Cafés"},
  {"categoria":"Compras","nome":"Lojas"},
  {"categoria":"Compras","nome":"Artesanato"}
]'::jsonb
WHERE nome IN ('Instagramável', 'Ótimo para fotos');

-- Gastronomia + Noite (última palavra — tags com categorias[] em ambas)
UPDATE tags SET subcategorias = '[
  {"categoria":"Gastronomia","nome":"Bares"},
  {"categoria":"Noite","nome":"Bares"},
  {"categoria":"Noite","nome":"Pubs"}
]'::jsonb
WHERE nome IN (
  'Happy hour', 'Drinks autorais', 'Música ao vivo', 'Ambiente intimista',
  'Chopp gelado', 'Carta de cervejas', 'Petiscos variados', 'Transmissão de jogos'
);

-- Re-sincroniza categorias a partir de subcategorias
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
