import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authApi, tokenStore, userStore, decodificarToken, tokenExpirado, SESSION_EXPIRED_EVENT,
} from '../services/api.js'

const AuthContext = createContext(null)

export const homeDoPerfil = (role) => (role === 'ADMIN' ? '/admin' : '/cliente')

// Se o token guardado já venceu (ex.: voltou ao site no dia seguinte), começa deslogado
function usuarioInicial() {
  const token = tokenStore.get()
  if (!token) return null
  if (tokenExpirado(token)) {
    tokenStore.clear()
    return null
  }
  return userStore.get()
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(usuarioInicial)

  const login = useCallback(async (email, senha) => {
    const { token, nome, role } = await authApi.login(email, senha)
    const u = { nome, role, email }
    tokenStore.set(token)
    userStore.set(u)
    setUsuario(u)
    return u
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  // Sessão acabou (401 em qualquer requisição, ou o token venceu): limpa tudo e vai pro login
  useEffect(() => {
    const onExpired = () => {
      tokenStore.clear()
      setUsuario(null)
      navigate('/login', { replace: true, state: { expirou: true } })
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [navigate])

  // Desloga sozinho no instante em que o token vence, mesmo sem nenhuma requisição
  useEffect(() => {
    const token = tokenStore.get()
    const exp = token && decodificarToken(token)?.exp
    if (!usuario || !exp) return
    const ms = Math.min(Math.max(exp * 1000 - Date.now(), 0), 2 ** 31 - 1)
    const id = setTimeout(() => window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT)), ms)
    return () => clearTimeout(id)
  }, [usuario])

  const value = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
