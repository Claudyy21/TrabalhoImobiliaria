import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { homeDoPerfil, useAuth } from '../context/AuthContext.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ email, senha }) {
  const e = {}
  if (!email.trim()) e.email = 'Informe o e-mail.'
  else if (!EMAIL_RE.test(email.trim())) e.email = 'E-mail inválido.'
  if (!senha) e.senha = 'Informe a senha.'
  return e
}

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroApi, setErroApi] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to={homeDoPerfil(usuario.role)} replace />

  const alterar = (campo) => (ev) => setForm({ ...form, [campo]: ev.target.value })

  async function enviar(ev) {
    ev.preventDefault()
    setErroApi(null)
    const v = validar(form)
    setErros(v)
    if (Object.keys(v).length) return

    setEnviando(true)
    try {
      const u = await login(form.email.trim(), form.senha)
      navigate(homeDoPerfil(u.role), { replace: true }) // cada perfil vai à sua área inicial
    } catch (e) {
      setErroApi(e.status === 401 ? 'E-mail ou senha incorretos.' : e.message)
    } finally {
      setEnviando(false)
    }
  }

  const campo = 'mt-1 w-full rounded-md border border-bruma bg-white px-3 py-2 outline-none focus:border-azul focus:ring-2 focus:ring-azul/20'

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-bruma bg-white p-6 shadow-sm">
      <h1 className="font-display text-2xl font-bold">Entrar</h1>

      {state?.expirou && (
        <p role="alert" className="mt-3 rounded bg-bruma p-2 text-sm">Sua sessão expirou. Entre novamente.</p>
      )}

      <form onSubmit={enviar} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <input id="email" type="email" autoComplete="username" value={form.email} onChange={alterar('email')} className={campo} />
          {erros.email && <p className="mt-1 text-sm text-alerta">{erros.email}</p>}
        </div>
        <div>
          <label htmlFor="senha" className="text-sm font-medium">Senha</label>
          <input id="senha" type="password" autoComplete="current-password" value={form.senha} onChange={alterar('senha')} className={campo} />
          {erros.senha && <p className="mt-1 text-sm text-alerta">{erros.senha}</p>}
        </div>

        {erroApi && <p role="alert" className="rounded bg-alerta/10 p-2 text-sm text-alerta">{erroApi}</p>}

        <button disabled={enviando} className="w-full rounded-md bg-azul py-2 font-medium text-white hover:bg-marinho disabled:opacity-60">
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
