-- ============================================================
--  Imobiliária — esquema do banco (MySQL 8+ / MariaDB 10.6+)
--
--  ATENÇÃO: este script é opcional. O backend cria as mesmas tabelas
--  sozinho (spring.jpa.hibernate.ddl-auto=update). Use este arquivo para
--  recriar o banco do zero ou para consultar a estrutura.
--
--  Uso:  mysql -u root -p < database/schema.sql
-- ============================================================

DROP DATABASE IF EXISTS imobiliaria;
CREATE DATABASE imobiliaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE imobiliaria;

CREATE TABLE bairros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255),
  cidade      VARCHAR(255),
  estado      VARCHAR(255),
  cep_inicial VARCHAR(255)
);

CREATE TABLE tipos_imoveis (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(255),
  descricao  TEXT,
  created_at DATETIME(6),
  updated_at DATETIME(6)
);

-- tipo = ADMIN ou USER. A senha é guardada com BCrypt.
-- O usuário admin é criado automaticamente pelo backend na primeira execução.
CREATE TABLE usuarios (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(255),
  email VARCHAR(255),
  senha VARCHAR(255),
  tipo  VARCHAR(255)
);

CREATE TABLE imoveis (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  titulo           VARCHAR(255),
  descricao        TEXT,
  preco_venda      DECIMAL(15,2),
  preco_aluguel    DECIMAL(15,2),
  finalidade       VARCHAR(255),   -- VENDA ou ALUGUEL
  status           VARCHAR(255),   -- DISPONIVEL, RESERVADO, ALUGADO, VENDIDO
  dormitorios      INT,
  banheiros        INT,
  garagem          INT,
  area_total       DECIMAL(15,2),
  area_construida  DECIMAL(15,2),
  endereco         VARCHAR(255),
  numero           VARCHAR(255),
  complemento      VARCHAR(255),
  cep              VARCHAR(255),
  caracteristicas  TEXT,
  destaque         BIT(1),
  tipo_imovel_id   INT,
  bairro_id        INT,
  created_at       DATETIME(6),
  updated_at       DATETIME(6),
  CONSTRAINT fk_imovel_tipo   FOREIGN KEY (tipo_imovel_id) REFERENCES tipos_imoveis (id),
  CONSTRAINT fk_imovel_bairro FOREIGN KEY (bairro_id)      REFERENCES bairros (id)
);

CREATE TABLE fotos_imoveis (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome_arquivo VARCHAR(255),
  caminho      VARCHAR(255),
  capa         BIT(1),
  ordem        INT,
  imovel_id    INT NOT NULL,
  CONSTRAINT fk_foto_imovel FOREIGN KEY (imovel_id) REFERENCES imoveis (id)
);

-- Tabelas previstas para os próximos checkpoints: ofertas, contratos e favoritos.
