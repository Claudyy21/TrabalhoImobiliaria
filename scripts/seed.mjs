// Cadastra bairros, tipos e imóveis de teste pela API.
//   node scripts/seed.mjs
// Opcional: API=http://localhost:8080 ADMIN_EMAIL=... ADMIN_SENHA=... node scripts/seed.mjs
import { readFileSync } from 'node:fs'

const API = process.env.API ?? 'http://localhost:8080'
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@imobiliaria.com'
const SENHA = process.env.ADMIN_SENHA ?? 'admin123'
const dados = JSON.parse(readFileSync(new URL('./seed-data.json', import.meta.url)))

async function chamar(caminho, { method = 'GET', body, token } = {}) {
  const res = await fetch(API + caminho, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${method} ${caminho} -> ${res.status}`)
  const texto = await res.text()
  return texto ? JSON.parse(texto) : null
}

const { token } = await chamar('/auth/login', { method: 'POST', body: { email: EMAIL, senha: SENHA } })
console.log('Login ok')

// Cria só o que ainda não existe (pelo nome) e devolve { nome: id }
async function garantir(rota, itens, chave = (x) => x.nome) {
  let existentes = await chamar(rota, { token })
  const mapa = Object.fromEntries(existentes.map((x) => [chave(x), x.id]))
  for (const item of itens) {
    if (mapa[chave(item)] == null) {
      await chamar(rota, { method: 'POST', body: item, token })
      console.log(`  + ${rota}: ${item.nome}`)
    }
  }
  existentes = await chamar(rota, { token })
  return Object.fromEntries(existentes.map((x) => [chave(x), x.id]))
}

const bairros = await garantir('/bairros', dados.bairros)
const tipos = await garantir('/tipos-imoveis', dados.tipos)

let n = 0
for (const im of dados.imoveis) {
  await chamar('/imoveis', {
    method: 'POST',
    token,
    body: { ...im, tipoImovel: { id: tipos[im.tipoImovel] }, bairro: { id: bairros[im.bairro] } },
  })
  n++
}
console.log(`Pronto: ${n} imóveis cadastrados.`)
