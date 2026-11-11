// Cliente HTTP central. Todas as telas passam por aqui, então:
//  - o token JWT é enviado em toda requisição autenticada
//  - os erros da API viram mensagens amigáveis (nunca JSON cru)
//  - 401 (sessão expirada) apaga o token e leva ao login

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'token'
const USER_KEY = 'usuario'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

export const userStore = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  set: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
}

// Lê o payload do JWT (sub, role, exp). Não valida assinatura — isso é do backend.
export function decodificarToken(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const tokenExpirado = (token) => {
  const exp = decodificarToken(token)?.exp
  return !exp || exp * 1000 <= Date.now()
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Avisa o AuthContext que a sessão acabou (sem acoplar api.js ao React)
export const SESSION_EXPIRED_EVENT = 'session-expired'

function mensagemPadrao(status) {
  switch (status) {
    case 400: return 'Dados inválidos. Confira os campos e tente novamente.'
    case 401: return 'Sua sessão expirou. Faça login novamente.'
    case 403: return 'Acesso negado. Você não tem permissão para isso.'
    case 404: return 'Item não encontrado.'
    case 409: return 'Esta ação conflita com uma regra do sistema.'
    case 500: case 502: case 503: case 504: return 'Erro no servidor. Tente novamente em instantes.'
    default: return 'Não foi possível concluir a operação.'
  }
}

async function lerCorpo(res) {
  const texto = await res.text()
  if (!texto) return null
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

// Tenta achar a mensagem de negócio que o backend mandou (usada no 409 e afins)
function mensagemDoCorpo(corpo) {
  if (!corpo) return null
  if (typeof corpo === 'string') return corpo.length < 200 && !corpo.trim().startsWith('<') ? corpo : null
  return corpo.message || corpo.mensagem || null
}

/**
 * request('/imoveis')
 * request('/auth/login', { method: 'POST', body: {...}, auth: false })
 * request('/fotos', { method: 'POST', body: formData })   // multipart
 */
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let payload
  if (body instanceof FormData) {
    payload = body // o navegador define o Content-Type com boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique se o backend está no ar.')
  }

  const corpo = await lerCorpo(res)
  if (res.ok) return corpo

  // 401 em rota autenticada = sessão expirada. No login (auth:false) é só senha errada.
  if (res.status === 401 && auth) {
    tokenStore.clear()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }

  const doBackend = [409, 400].includes(res.status) ? mensagemDoCorpo(corpo) : null
  throw new ApiError(res.status, doBackend || mensagemPadrao(res.status))
}

export const api = {
  get: (p, o) => request(p, { ...o, method: 'GET' }),
  post: (p, body, o) => request(p, { ...o, method: 'POST', body }),
  put: (p, body, o) => request(p, { ...o, method: 'PUT', body }),
  patch: (p, body, o) => request(p, { ...o, method: 'PATCH', body }),
  delete: (p, o) => request(p, { ...o, method: 'DELETE' }),
}

// ---- Endpoints (um lugar só para o contrato com o backend) ----
export const imoveisApi = {
  listar: () => api.get('/imoveis', { auth: false }),
  buscar: (id) => api.get(`/imoveis/${id}`, { auth: false }),
  // Envia o e-mail de interesse pelo backend (Mailgun). Público: não precisa de login.
  saberMais: (id, dados) => api.post(`/imoveis/sabermais/${id}`, dados, { auth: false }),
}

export const authApi = {
  login: (email, senha) => api.post('/public/login', { email, senha }, { auth: false }),
}

export const fotosApi = {
  listarPorImovel: (imovelId) => api.get(`/fotos/imovel/${imovelId}`, { auth: false }),
}

// A API devolve só o nome do arquivo; o backend serve em /uploads/{imovelId}/{arquivo}
export const fotoUrl = (foto, imovelId) => {
  if (!foto) return null
  const id = imovelId ?? foto.imovel?.id
  return `${BASE_URL}/uploads/${id}/${encodeURIComponent(foto.nomeArquivo)}`
}

// Capa = foto marcada como capa; senão a primeira da lista
export const escolherCapa = (fotos) => (fotos ?? []).find((f) => f.capa) ?? fotos?.[0] ?? null

