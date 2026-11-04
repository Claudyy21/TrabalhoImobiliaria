# Imobiliária — Trabalho Final

Sistema de imobiliária com **API REST (Spring Boot + MySQL)** e **front-end (React + Vite + Tailwind)**.

- **Aluno:** [SEU NOME]
- **Tecnologia do front-end (sorteio):** React + Vite

## Estrutura do repositório

```
.
├── backend/     API REST — Java 17, Spring Boot, Spring Security (JWT), JPA
├── frontend/    Interface — React + Vite + Tailwind CSS
└── database/    schema.sql (estrutura) e dados.sql (dados de teste)
```

## Requisitos

| Ferramenta | Versão |
|---|---|
| Java (JDK) | 17 ou superior |
| MySQL | 8 ou superior (MariaDB 10.6+ também serve) |
| Node.js | 18 ou superior |

O Maven não precisa estar instalado: o projeto usa o `mvnw` (Maven Wrapper).

## Como rodar

### 1. Banco de dados
Ligue o MySQL. Não é preciso criar nada à mão: o backend cria o banco `imobiliaria` e as tabelas na primeira execução.

Por padrão ele conecta com o usuário `root` e **senha vazia**. Se o seu MySQL tem senha, veja a seção [Configuração](#configuração).

*(Opcional)* Para criar o banco já com dados de exemplo (22 imóveis):
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p imobiliaria < database/dados.sql
```

### 2. Backend (porta 8080)
```bash
cd backend
./mvnw spring-boot:run          # Linux/macOS
mvnw.cmd spring-boot:run        # Windows
```
Na primeira execução é criado o usuário administrador:

| E-mail | Senha | Perfil |
|---|---|---|
| `admin@imobiliaria.com` | `admin123` | ADMIN |

### 3. Frontend (porta 5173)
```bash
cd frontend
npm install
npm run dev
```
Abra **http://localhost:5173**. Em desenvolvimento o Vite repassa `/api/*` para `http://localhost:8080`, então não há problema de CORS.

### 4. Dados de teste (se não usou o `dados.sql`)
Com o backend no ar:
```bash
cd frontend
node scripts/seed.mjs
```

## Configuração

O arquivo `backend/src/main/resources/application.properties` usa variáveis de ambiente com valores padrão.
Para trocar sem mexer no código, crie `backend/src/main/resources/secrets.properties` (copie o `secrets.properties.example`). Esse arquivo **não vai para o Git**.

| O que | Variável | Padrão |
|---|---|---|
| Nome do banco | `DB_NAME` | `imobiliaria` |
| Usuário do MySQL | `DB_USER` | `root` |
| Senha do MySQL | `DB_PASSWORD` | *(vazia)* |
| SMTP (e-mail) | `MAIL_USERNAME` / `MAIL_PASSWORD` | *(vazios)* |
| Chave do JWT | `JWT_SECRET` | chave de desenvolvimento |

> O envio de e-mail (botão "Entrar em contato") só funciona com as credenciais SMTP do Mailgun preenchidas.

## Perfis e permissões

| Perfil | Acessa |
|---|---|
| Público | Vitrine de imóveis, detalhe, login |
| `USER` (cliente) | Área do cliente (ofertas, favoritos, contratos) |
| `ADMIN` | Painel administrativo (CRUDs, ofertas, contratos, usuários) |

A API devolve **401** sem token, **403** sem permissão. O front apaga o token em 401 e leva ao login.

## Andamento

- [x] Checkpoint 1 — setup, listagem de imóveis em grade com paginação, login JWT, rotas protegidas
- [ ] Checkpoint 2 — detalhe, contato por e-mail, filtros, ordenação, ofertas
- [ ] Checkpoint 3 — favoritos, contratos, CRUDs do admin
- [ ] Checkpoint 4 — painel com gráficos, gestão de ofertas e contratos

Mais detalhes do front-end em [`frontend/README.md`](frontend/README.md).
