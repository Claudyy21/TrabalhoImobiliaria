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

## Estrutura
```
src/
  services/api.js        # fetch central: token Bearer, tratamento de 401/403/404/409, endpoints
  context/AuthContext    # login, logout, sessão expirada
  components/            # Navbar (menu por perfil), ProtectedRoute, Feedback, ImovelCard
  pages/                 # Home (vitrine), Login, telas de erro e placeholders
  hooks.js               # useFetch: carregando / erro / dados
```

## Progresso
- [x] Checkpoint 1 — setup, listagem de imóveis, login JWT, rotas protegidas
- [ ] Checkpoint 2 — detalhe, contato, paginação, filtros, ordenação, ofertas
- [ ] Checkpoint 3 — favoritos, contratos, CRUDs do admin
- [ ] Checkpoint 4 — painel com gráficos, gestão de ofertas/contratos, polimento
