// Envia fotos de teste para os imóveis já cadastrados.
//   node scripts/seed-fotos.mjs
// Opcional: FOTOS_POR_IMOVEL=3  API=http://localhost:8080  ADMIN_EMAIL=...  ADMIN_SENHA=...
//           IMG_URL="https://exemplo.com/{id}/{n}.jpg"   (troca a origem das imagens)
// Imóveis que já têm foto são pulados.

const API = process.env.API ?? 'http://localhost:8080'
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@imobiliaria.com'
const SENHA = process.env.ADMIN_SENHA ?? 'admin123'
const POR_IMOVEL = Number(process.env.FOTOS_POR_IMOVEL ?? 3)

const TAGS = { casa: 'house', apartamento: 'apartment', terreno: 'landscape', sala: 'office' }
const tagDe = (im) => TAGS[(im.tipoImovel?.nome ?? '').toLowerCase().split(' ')[0]] ?? 'house'

// Tenta fotos temáticas; se falhar, usa fotos aleatórias (picsum)
function origens(im, n) {
  if (process.env.IMG_URL) return [process.env.IMG_URL.replace('{id}', im.id).replace('{n}', n)]
  return [
    `https://loremflickr.com/800/600/${tagDe(im)}?lock=${im.id * 10 + n}`,
    `https://picsum.photos/seed/imovel-${im.id}-${n}/800/600`,
  ]
}

async function baixar(im, n) {
  for (const url of origens(im, n)) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      const tipo = res.headers.get('content-type') ?? ''
      if (res.ok && tipo.startsWith('image/')) return new Blob([await res.arrayBuffer()], { type: tipo })
    } catch { /* tenta a próxima origem */ }
  }
  return null
}

async function json(caminho, opcoes = {}) {
  const res = await fetch(API + caminho, opcoes)
  if (!res.ok) throw new Error(`${opcoes.method ?? 'GET'} ${caminho} -> ${res.status}`)
  const texto = await res.text()
  return texto ? JSON.parse(texto) : null
}

const { token } = await json('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, senha: SENHA }),
})
const auth = { Authorization: `Bearer ${token}` }
console.log('Login ok')

const imoveis = await json('/imoveis')
let enviadas = 0
for (const im of imoveis) {
  const ja = await json(`/fotos/imovel/${im.id}`)
  if (ja.length > 0) { console.log(`  = #${im.id} ${im.titulo}: já tem foto, pulando`); continue }

  for (let n = 1; n <= POR_IMOVEL; n++) {
    const blob = await baixar(im, n)
    if (!blob) { console.log(`  ! #${im.id}: não consegui baixar a foto ${n}`); continue }
    const form = new FormData()
    form.append('arquivo', blob, `foto-${n}.jpg`)
    form.append('imovelId', String(im.id))
    await json('/fotos', { method: 'POST', headers: auth, body: form })
    enviadas++
  }
  console.log(`  + #${im.id} ${im.titulo}`)
}
console.log(`Pronto: ${enviadas} fotos enviadas.`)
