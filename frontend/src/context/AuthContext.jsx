import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, tokenStore, userStore, SESSION_EXPIRED_EVENT } from '../services/api.js'

const AuthContext = createContext(null)

export const homeDoPerfil = (role) => (role === 'ADMIN' ? '/admin' : '/cliente')

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(() => (tokenStore.get() ? userStore.get() : null))

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

  // 401 vindo de qualquer requisição: limpa a sessão e manda pro login
  useEffect(() => {
    const onExpired = () => {
      setUsuario(null)
      navigate('/login', { replace: true, state: { expirou: true } })
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [navigate])

  const value = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
