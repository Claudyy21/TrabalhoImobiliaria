-- Dados de teste: 6 bairros, 4 tipos e 22 imóveis (20 disponíveis, 1 reservado, 1 alugado).
-- Execute depois do schema.sql:  mysql -u root -p imobiliaria < database/dados.sql
USE imobiliaria;

INSERT INTO bairros (id, nome, cidade, estado, cep_inicial) VALUES
  (1, 'Centro', 'Ijuí', 'RS', '98700'),
  (2, 'Bela Vista', 'Ijuí', 'RS', '98700'),
  (3, 'Industrial', 'Cruz Alta', 'RS', '98005'),
  (4, 'Jardim América', 'Santa Rosa', 'RS', '98900'),
  (5, 'São José', 'Carazinho', 'RS', '99500'),
  (6, 'Lago Azul', 'Santa Rosa', 'RS', '98900');

INSERT INTO tipos_imoveis (id, nome, descricao, created_at, updated_at) VALUES
  (1, 'Casa', 'Casa residencial', NOW(6), NOW(6)),
  (2, 'Apartamento', 'Apartamento em condomínio', NOW(6), NOW(6)),
  (3, 'Terreno', 'Terreno urbano', NOW(6), NOW(6)),
  (4, 'Sala Comercial', 'Sala para uso comercial', NOW(6), NOW(6));

INSERT INTO imoveis (titulo, descricao, preco_venda, preco_aluguel, finalidade, status, dormitorios, banheiros, garagem, area_total, area_construida, endereco, numero, complemento, cep, caracteristicas, destaque, tipo_imovel_id, bairro_id, created_at, updated_at) VALUES
  ('Casa ampla com pátio', 'Casa ampla com pátio. Imóvel bem localizado, pronto para morar ou investir.', 520000, NULL, 'VENDA', 'DISPONIVEL', 3, 2, 2, 180, 144, 'Rua das Acácias', '100', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 1, 1, 1, NOW(6), NOW(6)),
  ('Apartamento próximo à praça', 'Apartamento próximo à praça. Imóvel bem localizado, pronto para morar ou investir.', NULL, 1800, 'ALUGUEL', 'DISPONIVEL', 2, 1, 1, 70, 56, 'Rua das Acácias', '107', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 1, NOW(6), NOW(6)),
  ('Casa térrea com churrasqueira', 'Casa térrea com churrasqueira. Imóvel bem localizado, pronto para morar ou investir.', 410000, NULL, 'VENDA', 'DISPONIVEL', 3, 2, 1, 150, 120, 'Rua das Acácias', '114', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 2, NOW(6), NOW(6)),
  ('Apartamento mobiliado', 'Apartamento mobiliado. Imóvel bem localizado, pronto para morar ou investir.', NULL, 2200, 'ALUGUEL', 'DISPONIVEL', 1, 1, 1, 48, 38, 'Rua das Acácias', '121', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 2, NOW(6), NOW(6)),
  ('Terreno plano 360m²', 'Terreno plano 360m². Imóvel bem localizado, pronto para morar ou investir.', 135000, NULL, 'VENDA', 'DISPONIVEL', 0, 0, 0, 360, 0, 'Rua das Acácias', '128', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 3, 3, NOW(6), NOW(6)),
  ('Sala comercial térrea', 'Sala comercial térrea. Imóvel bem localizado, pronto para morar ou investir.', NULL, 2900, 'ALUGUEL', 'DISPONIVEL', 0, 1, 0, 45, 36, 'Rua das Acácias', '135', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 1, 4, 1, NOW(6), NOW(6)),
  ('Sobrado moderno', 'Sobrado moderno. Imóvel bem localizado, pronto para morar ou investir.', 780000, NULL, 'VENDA', 'DISPONIVEL', 4, 3, 2, 240, 192, 'Rua das Acácias', '142', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 4, NOW(6), NOW(6)),
  ('Apartamento com sacada', 'Apartamento com sacada. Imóvel bem localizado, pronto para morar ou investir.', 360000, NULL, 'VENDA', 'DISPONIVEL', 2, 2, 1, 82, 66, 'Rua das Acácias', '149', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 4, NOW(6), NOW(6)),
  ('Casa para família grande', 'Casa para família grande. Imóvel bem localizado, pronto para morar ou investir.', NULL, 2600, 'ALUGUEL', 'DISPONIVEL', 4, 2, 2, 190, 152, 'Rua das Acácias', '156', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 5, NOW(6), NOW(6)),
  ('Kitnet para estudante', 'Kitnet para estudante. Imóvel bem localizado, pronto para morar ou investir.', NULL, 950, 'ALUGUEL', 'DISPONIVEL', 1, 1, 0, 28, 22, 'Rua das Acácias', '163', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 1, NOW(6), NOW(6)),
  ('Terreno de esquina', 'Terreno de esquina. Imóvel bem localizado, pronto para morar ou investir.', 210000, NULL, 'VENDA', 'DISPONIVEL', 0, 0, 0, 450, 0, 'Rua das Acácias', '170', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 1, 3, 6, NOW(6), NOW(6)),
  ('Casa com piscina', 'Casa com piscina. Imóvel bem localizado, pronto para morar ou investir.', 890000, NULL, 'VENDA', 'DISPONIVEL', 4, 3, 3, 280, 224, 'Rua das Acácias', '177', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 6, NOW(6), NOW(6)),
  ('Apartamento 3 quartos', 'Apartamento 3 quartos. Imóvel bem localizado, pronto para morar ou investir.', 330000, NULL, 'VENDA', 'DISPONIVEL', 3, 2, 1, 92, 74, 'Rua das Acácias', '184', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 5, NOW(6), NOW(6)),
  ('Sala comercial com recepção', 'Sala comercial com recepção. Imóvel bem localizado, pronto para morar ou investir.', NULL, 3500, 'ALUGUEL', 'DISPONIVEL', 0, 2, 2, 80, 64, 'Rua das Acácias', '191', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 4, 3, NOW(6), NOW(6)),
  ('Casa geminada', 'Casa geminada. Imóvel bem localizado, pronto para morar ou investir.', NULL, 1500, 'ALUGUEL', 'DISPONIVEL', 2, 1, 1, 85, 68, 'Rua das Acácias', '198', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 3, NOW(6), NOW(6)),
  ('Cobertura duplex', 'Cobertura duplex. Imóvel bem localizado, pronto para morar ou investir.', 1250000, NULL, 'VENDA', 'DISPONIVEL', 3, 3, 2, 160, 128, 'Rua das Acácias', '205', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 1, 2, 1, NOW(6), NOW(6)),
  ('Casa de esquina reformada', 'Casa de esquina reformada. Imóvel bem localizado, pronto para morar ou investir.', NULL, 2100, 'ALUGUEL', 'DISPONIVEL', 3, 2, 1, 130, 104, 'Rua das Acácias', '212', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 1, 2, NOW(6), NOW(6)),
  ('Terreno em loteamento novo', 'Terreno em loteamento novo. Imóvel bem localizado, pronto para morar ou investir.', 95000, NULL, 'VENDA', 'DISPONIVEL', 0, 0, 0, 300, 0, 'Rua das Acácias', '219', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 3, 5, NOW(6), NOW(6)),
  ('Apartamento compacto', 'Apartamento compacto. Imóvel bem localizado, pronto para morar ou investir.', NULL, 1350, 'ALUGUEL', 'DISPONIVEL', 1, 1, 1, 40, 32, 'Rua das Acácias', '226', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 6, NOW(6), NOW(6)),
  ('Sala comercial no centro', 'Sala comercial no centro. Imóvel bem localizado, pronto para morar ou investir.', 280000, NULL, 'VENDA', 'DISPONIVEL', 0, 1, 1, 55, 44, 'Rua das Acácias', '233', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 4, 1, NOW(6), NOW(6)),
  ('Casa já reservada', 'Casa já reservada. Imóvel bem localizado, pronto para morar ou investir.', 470000, NULL, 'VENDA', 'RESERVADO', 3, 2, 2, 160, 128, 'Rua das Acácias', '240', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 1, 1, 4, NOW(6), NOW(6)),
  ('Apartamento já alugado', 'Apartamento já alugado. Imóvel bem localizado, pronto para morar ou investir.', NULL, 1700, 'ALUGUEL', 'ALUGADO', 2, 1, 1, 66, 53, 'Rua das Acácias', '247', NULL, '98700-000', 'Boa iluminação, rua asfaltada', 0, 2, 2, NOW(6), NOW(6));
