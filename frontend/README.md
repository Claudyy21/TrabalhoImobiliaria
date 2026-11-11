# Imobiliária — Front-end (React + Vite + Tailwind)

Front-end do sistema da imobiliária, consumindo a API REST Spring Boot desenvolvida em aula.

## Requisitos
- Node.js 18+
- Backend rodando em `http://localhost:8080` (MySQL ligado; o admin é criado na primeira execução:
  `admin@imobiliaria.com` / `admin123`)

## Como rodar
```bash
npm install
npm run dev        # http://localhost:5173
```

Em desenvolvimento o Vite faz proxy de `/api/*` para `http://localhost:8080/*` (ver `vite.config.js`),
o que evita erro de CORS. Para apontar para outra API, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.

```bash
npm run build      # gera a pasta dist/
```

## Dados de teste
Com o backend no ar e o admin criado:
```bash
node scripts/seed.mjs
```
Cadastra 6 bairros, 4 tipos e 22 imóveis (20 disponíveis, 1 reservado e 1 alugado), a partir de `scripts/seed-data.json`.
Pode rodar mais de uma vez: bairros e tipos não são duplicados, mas os imóveis sim.

### Fotos de teste
Depois do seed dos imóveis (e de aplicar os ajustes de backend das fotos):
```bash
node scripts/seed-fotos.mjs
```
Envia 3 fotos por imóvel (a primeira vira a capa). Usa a internet para baixar as imagens.

## Funcionalidades
- **Vitrine** em grade 4×2 com paginação, **filtros** (bairro, finalidade, faixa de preço — combináveis) e **ordenação** por preço. Tudo fica na URL (`?bairro=2&finalidade=venda&ordem=menor&pagina=2`), então dá para compartilhar o link.
- **Detalhe do imóvel** com galeria de fotos e botão **Entrar em contato**, que abre o e-mail com assunto e corpo preenchidos (código, tipo, bairro e valor). O destinatário vem de `VITE_EMAIL_IMOBILIARIA`.
- **Login** com validação (campos obrigatórios e formato do e-mail) e mensagens distintas para credencial inválida e servidor fora do ar.
- **Rotas protegidas por perfil**: sem token vai para o login; perfil errado vai para "Acesso negado". Token expirado (ou 401 da API) apaga a sessão e volta ao login.
- **Menu** muda conforme o perfil e **logout** apaga o token.

## Scripts úteis
| Comando | O que faz |
|---|---|
| `node scripts/checar-api.mjs` | Confere os 9 comportamentos da API (público, login, token, 401, 403, token adulterado) |
| `node scripts/seed.mjs` | Cadastra bairros, tipos e 22 imóveis de teste |
| `node scripts/seed-fotos.mjs` | Envia fotos de teste para os imóveis |

## Estrutura
```
src/
  services/api.js        # fetch central: token Bearer, 401/403/404/409, leitura do JWT
  context/AuthContext    # login, logout, sessão expirada (inclusive por tempo)
  components/            # Navbar (menu por perfil), ProtectedRoute, Filtros, Galeria, ImovelCard, Paginacao, Feedback
  pages/                 # Home (vitrine), DetalheImovel, Login, telas de erro e placeholders
  utils/                 # format.js (moeda, status) e filtros.js (filtrar, ordenar)
  hooks.js               # useFetch: carregando / erro / dados
```

## Progresso
- [x] Checkpoint 1 — setup, listagem de imóveis, login JWT, rotas protegidas
- [x] Checkpoint 2 — detalhe, contato, paginação, filtros, ordenação
- [ ] Checkpoint 3 — ofertas, favoritos, contratos, CRUDs do admin
- [ ] Checkpoint 4 — painel com gráficos, gestão de ofertas/contratos, polimento
