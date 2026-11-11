// Confere como a API se comporta ANTES de construir as telas (tabela da Aula 2).
//   node scripts/checar-api.mjs
// Opcional: API=http://localhost:8080  ADMIN_EMAIL=...  ADMIN_SENHA=...

const API = process.env.API ?? 'http://localhost:8080'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@imobiliaria.com'
const ADMIN_SENHA = process.env.ADMIN_SENHA ?? 'admin123'
const CLIENTE = { nome: 'Cliente Teste', email: 'cliente.teste@imobiliaria.com', senha: 'cliente123', tipo: 'USER' }

const json = { 'Content-Type': 'application/json' }
const bearer = (t) => (t ? { Authorization: `Bearer ${t}` } : {})
const chamar = (caminho, { method = 'GET', token, body } = {}) =>
  fetch(API + caminho, { method, headers: { ...json, ...bearer(token) }, body: body && JSON.stringify(body) })

function payload(token) {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')) } catch { return null }
}

let falhas = 0
function linha(n, requisicao, esperado, obtido, ok, extra = '') {
  if (!ok) falhas++
  console.log(`${ok ? '✅' : '❌'} ${String(n).padStart(2)}. ${requisicao.padEnd(44)} esperado ${String(esperado).padEnd(4)} obtido ${obtido}${extra ? '  ' + extra : ''}`)
}

console.log(`\nChecando a API em ${API}\n`)

// 1 — vitrine pública
let r = await chamar('/imoveis')
linha(1, 'GET /imoveis (sem token)', 200, r.status, r.status === 200)

// 2 — login do admin
r = await chamar('/public/login', { method: 'POST', body: { email: ADMIN_EMAIL, senha: ADMIN_SENHA } })
const login = r.ok ? await r.json() : {}
linha(2, 'POST /public/login (admin)', 200, r.status, r.status === 200 && !!login.token,
  login.token ? `tipo="${login.tipo}" role="${login.role}"` : '')
const tokenAdmin = login.token
if (!tokenAdmin) { console.log('\nSem token de admin não dá para continuar. Confira e-mail/senha e se o backend está no ar.'); process.exit(1) }

// 3 — o que tem dentro do token (para colar em jwt.io)
const p = payload(tokenAdmin)
const venceEm = p?.exp ? new Date(p.exp * 1000) : null
linha(3, 'Conteúdo do token (jwt.io)', 'sub+exp', p ? 'lido' : 'ilegível', !!(p?.sub && venceEm && venceEm > new Date()),
  p ? `sub=${p.sub} role=${p.role ?? p.tipo} exp=${venceEm?.toLocaleString('pt-BR')}` : '')

// 4 — rota protegida sem login
const bairro = { nome: 'Bairro de Teste (checar-api)', cidade: 'Cidade Teste', estado: 'RS', cepInicial: '00000' }
r = await chamar('/bairros', { method: 'POST', body: bairro })
linha(4, 'POST /bairros (sem token)', 401, r.status, r.status === 401)

// 5 — admin tem permissão
r = await chamar('/bairros', { method: 'POST', token: tokenAdmin, body: bairro })
linha(5, 'POST /bairros (admin)', 201, r.status, r.status === 201)

// 6 — só o admin cadastra usuários
r = await chamar('/users', { method: 'POST', token: tokenAdmin, body: CLIENTE })
linha(6, 'POST /users cliente "tipo":"USER" (admin)', 201, r.status, r.status === 201 || r.status === 409,
  r.status === 409 ? '(já existia de uma execução anterior — ok)' : '')

// 7 — login do cliente
r = await chamar('/public/login', { method: 'POST', body: { email: CLIENTE.email, senha: CLIENTE.senha } })
const loginCli = r.ok ? await r.json() : {}
linha(7, 'POST /public/login (cliente)', 200, r.status, r.status === 200 && loginCli.role === 'USER', `role="${loginCli.role}"`)

// 8 — logado, mas sem permissão
r = await chamar('/bairros', { method: 'POST', token: loginCli.token, body: bairro })
linha(8, 'POST /bairros (cliente)', 403, r.status, r.status === 403)

// 9 — token adulterado (troca o perfil no payload e mantém a assinatura antiga)
const [h, , sig] = tokenAdmin.split('.')
const falso = Buffer.from(JSON.stringify({ ...p, role: 'ADMIN', sub: 'invasor@teste.com' })).toString('base64url')
r = await chamar('/bairros', { method: 'POST', token: `${h}.${falso}.${sig}`, body: bairro })
linha(9, 'POST /bairros (token adulterado)', 401, r.status, r.status === 401)

// limpeza: apaga o bairro de teste criado no passo 5
try {
  const lista = await (await chamar('/bairros')).json()
  for (const b of lista.filter((x) => x.nome === bairro.nome)) await chamar(`/bairros/${b.id}`, { method: 'DELETE', token: tokenAdmin })
} catch { /* limpeza é opcional */ }

console.log(falhas === 0
  ? `\n🎉 Tudo certo. Cliente de teste para o front: ${CLIENTE.email} / ${CLIENTE.senha}\n`
  : `\n⚠️  ${falhas} verificação(ões) falharam. Veja as linhas ❌ acima.\n`)
process.exit(falhas === 0 ? 0 : 1)
