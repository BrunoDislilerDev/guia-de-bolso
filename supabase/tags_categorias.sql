-- 1. Adicionar coluna categorias à tabela tags
ALTER TABLE tags ADD COLUMN IF NOT EXISTS categorias jsonb DEFAULT '[]';

-- 2. Vincular cada tag às categorias compatíveis
UPDATE tags SET categorias = '["Gastronomia","Serviços","Compras","Hospedagem","Noite","Bem-estar","Cultura"]'::jsonb WHERE id = 7;  -- Aceita cartão
UPDATE tags SET categorias = '["Natureza","Gastronomia","Serviços","Hospedagem","Cultura","Compras","Bem-estar","Noite"]'::jsonb WHERE id = 5;  -- Acessível
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 13;  -- Acesso apenas por trilha
UPDATE tags SET categorias = '["Noite","Gastronomia"]'::jsonb WHERE id = 20;  -- Agitado
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 31;  -- Água fria
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 32;  -- Água morna
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 46;  -- Área de churrasco
UPDATE tags SET categorias = '["Natureza","Serviços"]'::jsonb WHERE id = 47;  -- Banheiros disponíveis
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 41;  -- Cachoeira para nadar
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem"]'::jsonb WHERE id = 36;  -- Cachorros permitidos
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 53;  -- Camping permitido
UPDATE tags SET categorias = '["Natureza","Cultura","Aventura","Gastronomia","Hospedagem"]'::jsonb WHERE id = 22;  -- Cenário único
UPDATE tags SET categorias = '["Natureza","Aventura","Cultura"]'::jsonb WHERE id = 42;  -- Com guia
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 45;  -- Corais
UPDATE tags SET categorias = '["Natureza","Aventura","Gastronomia"]'::jsonb WHERE id = 12;  -- Escondido
UPDATE tags SET categorias = '["Natureza","Gastronomia","Serviços","Hospedagem","Compras","Cultura","Bem-estar","Noite"]'::jsonb WHERE id = 6;  -- Estacionamento
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 37;  -- Estrada de terra
UPDATE tags SET categorias = '["Natureza","Hospedagem","Gastronomia"]'::jsonb WHERE id = 28;  -- Evitar em alta temporada
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem","Serviços","Compras","Cultura","Aventura"]'::jsonb WHERE id = 3;  -- Familiar
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem","Noite"]'::jsonb WHERE id = 1;  -- Frente mar
UPDATE tags SET categorias = '["Natureza","Cultura"]'::jsonb WHERE id = 23;  -- Grátis
UPDATE tags SET categorias = '["Cultura","Natureza"]'::jsonb WHERE id = 21;  -- Histórico
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem","Serviços","Compras","Aventura"]'::jsonb WHERE id = 35;  -- Ideal para crianças
UPDATE tags SET categorias = '["Aventura","Natureza","Bem-estar"]'::jsonb WHERE id = 29;  -- Ideal para iniciantes
UPDATE tags SET categorias = '["Natureza","Gastronomia","Noite","Cultura","Hospedagem","Aventura"]'::jsonb WHERE id = 18;  -- Instagramável
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 34;  -- Mar agitado
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 33;  -- Mar calmo
UPDATE tags SET categorias = '["Noite","Gastronomia","Natureza"]'::jsonb WHERE id = 27;  -- Melhor à noite
UPDATE tags SET categorias = '["Natureza","Gastronomia"]'::jsonb WHERE id = 26;  -- Melhor à tarde
UPDATE tags SET categorias = '["Natureza","Gastronomia","Bem-estar","Aventura"]'::jsonb WHERE id = 25;  -- Melhor de manhã
UPDATE tags SET categorias = '["Gastronomia","Noite"]'::jsonb WHERE id = 10;  -- Música ao vivo
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem"]'::jsonb WHERE id = 16;  -- Nascer do sol
UPDATE tags SET categorias = '["Natureza","Gastronomia","Noite","Cultura","Hospedagem","Aventura"]'::jsonb WHERE id = 17;  -- Ótimo para fotos
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 44;  -- Ótimo para mergulho
UPDATE tags SET categorias = '["Aventura","Natureza"]'::jsonb WHERE id = 30;  -- Para experientes
UPDATE tags SET categorias = '["Gastronomia","Hospedagem"]'::jsonb WHERE id = 4;  -- Pet friendly
UPDATE tags SET categorias = '["Natureza","Gastronomia","Noite"]'::jsonb WHERE id = 15;  -- Pôr do sol imperdível
UPDATE tags SET categorias = '["Natureza","Gastronomia","Bem-estar","Hospedagem"]'::jsonb WHERE id = 19;  -- Pouco movimentado
UPDATE tags SET categorias = '["Gastronomia","Natureza","Aventura","Bem-estar","Cultura","Hospedagem"]'::jsonb WHERE id = 24;  -- Reserva necessária
UPDATE tags SET categorias = '["Gastronomia","Hospedagem","Noite","Natureza"]'::jsonb WHERE id = 2;  -- Romântico
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 49;  -- Salva-vidas
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 43;  -- Sem guia necessário
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 48;  -- Sem infraestrutura
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 51;  -- Sem sombra
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 38;  -- Só de carro
UPDATE tags SET categorias = '["Natureza"]'::jsonb WHERE id = 50;  -- Sombra natural
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 52;  -- Trilha acessível
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 40;  -- Trilha curta
UPDATE tags SET categorias = '["Natureza","Aventura"]'::jsonb WHERE id = 39;  -- Trilha longa
UPDATE tags SET categorias = '["Gastronomia"]'::jsonb WHERE id = 8;  -- Vegano/Vegetariano
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem","Aventura"]'::jsonb WHERE id = 14;  -- Vista panorâmica
UPDATE tags SET categorias = '["Natureza","Gastronomia","Hospedagem"]'::jsonb WHERE id = 11;  -- Vista para o mar
UPDATE tags SET categorias = '["Gastronomia","Hospedagem","Serviços","Compras","Cultura","Noite"]'::jsonb WHERE id = 9;  -- Wi-Fi
